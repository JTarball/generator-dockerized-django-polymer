 /*jshint node:true */
'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var path = require('path');
var folderName = path.basename(process.cwd());
var pjson = require('../package.json'); // can get the version - cool!

var DockerizedDjangoPolymerGenerator = generators.Base.extend({


    polymer: function() {
        this.log('Installing Polymer Official Generator...');
        
        // ---------------- Destination Root Change Here ------------------------------
        // NOTE: We have changed the destination root to accomodate polymer generator!!
        this.destinationRoot('docker/app/app')

        this.composeWith('polymer', {
            options: {
                "skip-install": true
            }
        });
    },

    askForProjectInfo: function() {
        var done = this.async();

        // Have a Yeoman greet the user 
        this.log(yosay("Welcome to the awesome Django Polymer Generator.\nI'm fired up..."));
        this.log("I have a number of questions.. it might take a min or so... but it will be worth it... ");

        var prompts = [{
            type: 'input',
            name: 'projectName',
            message: 'What is your Django project name?',
            default: folderName
        }, {
            type: 'input',
            name: 'adminName',
            message: 'What is the admin name?',
            default: 'James Tarball'
        }, {
            type: 'input',
            name: 'adminEmail',
            message: 'What is the admin email?',
            default: 'james.tarball@gmail.com'
        }, {
            type: 'list',
            name: 'djangoVersion',
            message: 'Which version of Django would you like to use?',
            store: true, // allows you to specify that from now on you want to use the answer as the default value
            choices: ['1.8'],
            default: 0
        }];

        this.prompt(prompts, function(props) {
            this.projectName = props.projectName;
            this.adminName = props.adminName;
            this.adminEmail = props.adminEmail;
            this.djangoVersion = props.djangoVersion;
            done();
        }.bind(this));
    },

    askForDatabaseInfo: function() {
        var done = this.async();

        function isActive(answers) {
            return answers && answers.databaseEngine && (answers.databaseEngine == 'mysql' || answers.databaseEngine == 'postgresql');
        }

        var prompts = [{
            when: function(answers) {
                return isActive(answers);
            },
            type: 'list',
            name: 'databaseEngine',
            message: 'Which database would you like to use? (postgresql only available at present)',
            choices: [
                //{
                //     value: 'mysql',
                //     name: 'MySQL',
                //}
                //, {
                //   value: 'sqlite3',
                //   name: 'SQLite3'
                //}, 
                {
                   value: 'postgresql',
                   name: 'PostgreSQL'
                }
            ]
        }, {
            type: 'input',
            name: 'databaseName',
            message: 'Please enter the database name',
            default: this.projectName
        }, {
            type: 'input',
            name: 'databaseUser',
            message: 'Please enter the database user',
            default: 'root'
        }, {
            type: 'input',
            name: 'databasePassword',
            message: 'Please enter the database password',
            default: 'password'
        }, {
            type: 'input',
            name: 'databaseHost',
            message: 'Please enter the database host',
            default: 'postgres'
        }, {
            type: 'input',
            name: 'databasePort',
            message: 'Please enter the database port',
            default: '5432'
        }];

        this.prompt(prompts, function(props) {
            this.databaseEngine = props.databaseEngine;
            this.databaseName = props.databaseName;
            if (this.databaseEngine !== 'dbSqlite3') {
                this.databaseUser = props.databaseUser;
                this.databasePassword = props.databasePassword;
                this.databaseHost = props.databaseHost;
                this.databasePort = props.databasePort;
            }

            done();
        }.bind(this));

    },

    docker: function() {
        // Basic Files
        this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('../../../README.md'));
        this.fs.copyTpl(this.templatePath('LICENSE'), this.destinationPath('../../../LICENSE'));
        //this.fs.copyTpl(this.templatePath('.gitignore'), this.destinationPath('../../../.gitignore'));
        // Docker Toolbox
        this.fs.copyTpl(this.templatePath('docker-compose.yml'), this.destinationPath('../../../docker-compose.yml'));
        this.fs.copyTpl(this.templatePath('production-template.yml'), this.destinationPath('../../../production-template.yml'));
        // Main Environments File
        // Environment Variables configures django settings
        // Currently only support postgres
        this.databaseEngine = 'django.db.backends.postgresql_psycopg2';
        this.logLevel = 'DEBUG';
        this.devSettings = 'True';
        this.fs.copyTpl(this.templatePath('env'), this.destinationPath('../../../env'), {
            admin_name: this.adminName,
            admin_email: this.adminEmail,
            db_engine: this.databaseEngine,
            db_name: this.databaseName,
            db_user: this.databaseUser,
            db_password: this.databasePassword,
            db_host: this.databaseHost,
            db_port: this.databasePort,
            dj_loglevel: this.logLevel,
            dj_devsettings: this.devSettings
        });
        // For Circle CI Testing
        this.fs.copyTpl(this.templatePath('circle.yml'), this.destinationPath('../../../circle.yml'));
        // Create Docker Machine on AWS
        this.fs.copyTpl(this.templatePath('create-docker-machine-aws.sh'), this.destinationPath('../../../create-docker-machine-aws.sh'));
        // Deployment: Build, Tag & Create New Docker Compose file based on new images
        this.fs.copyTpl(this.templatePath('build-tag-push.py'), this.destinationPath('../../../build-tag-push.py'));
    },

    app: function() {
        // create secret key
        this.secretKey = require('crypto').randomBytes(Math.ceil(50 * 3 / 4)).toString('base64');
        this.releaseVersion = pjson.version;
        // This is laxy but it works copy the whole docker directory
        // The generator version and secret_key are in django settings file base.py
        this.fs.copyTpl(this.templatePath('docker/'), this.destinationPath('../../../docker/'),{
           generator_version: this.releaseVersion,
           secret_key: this.secretKey,
        });
        // Need to create some empty directories
        this.fs.copyTpl(this.templatePath('docker/app/app/backend/project/static/'), this.destinationPath('../../../docker/app/app/backend/project/static/'));
        this.fs.copyTpl(this.templatePath('docker/app/app/backend/project/media/'), this.destinationPath('../../../docker/app/app/backend/project/media/'));
    },

    // Finally, (See run context order in yeoman generator docs)
    end: function() {
        if (!this.options['skip-install']) {
            this.installDependencies();
        }
        this.log(yosay("Excellent! You are ready for action!"));
    }
});


module.exports = DockerizedDjangoPolymerGenerator