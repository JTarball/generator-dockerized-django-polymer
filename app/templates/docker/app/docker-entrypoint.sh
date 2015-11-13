#!/bin/bash
set -e


if [ "$1" = 'app' ]; then

	echo "Basic Check of required Environment Variables"

	if [ -z "$APP_DIR" ]; then
		echo >&2 'error: you have not set required environment variables: APP_DIR'
		exit 1
	fi

	if [ -z "$SUPERUSER_NAME" -o -z "$SUPERUSER_EMAIL" -o -z "$SUPERUSER_PASSWORD" ]; then
		echo >&2 'error: you have not set required environment variables: SUPERUSER_NAME, SUPERUSER_EMAIL and SUPERUSER_PASSWORD'
		exit 1
	fi

	echo "Checks Successfully. $#"

	case "$1" in
		--create)
			# First Time - Create SuperUser, install polymer & make migrations
			echo "Creating Superuser $SUPERUSER_NAME"
			echo "from django.contrib.auth.models import User; User.objects.create_superuser('$SUPERUSER_NAME', '$SUPERUSER_EMAIL', '$SUPERUSER_PASSWORD')" | python manage.py shell

			echo 'Installing Polymer Components'
			cd $APP_DIR &&  which yes > /dev/null; if [ $? -eq 0 ]; then yes | npm install -g gulp bower && npm install && bower install; fi

			echo "Make First-Time Migrations for apps: blog, accounts"
			python $APP_DIR/backend/manage.py makemigrations blog accounts
			;;
		# --dev)
		# 	ENV_FLAG="dev"
		# ;;
		# --dev)
		# 	ENV_FLAG="prod"
		# ;;
		# --interactive)
		# 	ENV_FLAG="interactive"
		# ;;
	esac

	# Future: add some basic checks that 'backend/' and 'manage.py' exist etc.
	echo "Migrate Django"
	python $APP_DIR/backend/manage.py migrate

	echo "Collect Static Files"
	python $APP_DIR/backend/manage.py collectstatic --noinput

	if [ "$ENV_TYPE" = 'dev' ]; then
		echo "Running Django Developement Server"
		python $APP_DIR/backend/manage.py runserver_plus 0.0.0.0:8000 &
		echo "Running FrontEnd Development Polymer "
		gulp serve &
	elif [ "$ENV_TYPE" = 'prod' ]; then
		echo "Running Production Django Server Script"
		python $APP_DIR/backend/bin/run.py
		echo "Running FrontEnd Polymer"
		gulp &
	else
		echo "Default - do Nothing"
	fi

	echo
	echo 'App init process done. Ready for start up.'
		echo

	exec gosu app "$@"
fi

exec "$@"
