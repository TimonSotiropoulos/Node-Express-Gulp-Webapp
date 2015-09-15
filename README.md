# adherium

- Staging: http://adherium.herokuapp.com

## Prequisites

[Git](http://www.git-scm.com/)

[Ruby](https://rvm.io/)

    curl -sSL https://get.rvm.io | bash -s stable --ruby

Compass Depends on ruby being installed

    gem install compass

[NodeJs](http://nodejs.org/)

[Bower](http://bower.io/)

    sudo npm install -g bower

[Gulp](http://gulpjs.com/)

    sudo npm install -g gulp

[Yeoman](http://yeoman.io)

    sudo npm install -g yo


Install all prerequisites before running the steps below

## Running Dev environment

To initalize the dev environment run

    npm install && bower install

To start local development server

    gulp

You can browse to the website via http://localhost:3000/
## Deployments

### Setup Heroku
We use heroku for deploying to staging.

[Download](https://toolbelt.heroku.com/) and install the heroku toolbelt

Login to heroku with your username and password - note, you must be added to the project in the heroku webapp dashboard by the owner of the heroku app.

    heroku login


Change directory to dist and pull down the heroku remote. Note if there is no dist folder run `mkdir dist`  first

        cd dist
        heroku git:clone -a adherium .

### Deploying to heroku - STAGING

Run `gulp build` from the project root directory, change to `dist` folder and commit changes to heroku

    $ gulp build
    $ cd dist
    $ git commit -am "Write commit message here"
    $ git push heroku master
