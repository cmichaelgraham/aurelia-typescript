mkdir aurelia-latest-repos

cd aurelia-latest-repos

git clone git://github.com/aurelia/metadata
git clone git://github.com/aurelia/dependency-injection
git clone git://github.com/aurelia/router
git clone git://github.com/aurelia/http-client
git clone git://github.com/aurelia/path
git clone git://github.com/aurelia/history
git clone git://github.com/aurelia/event-aggregator
git clone git://github.com/aurelia/route-recognizer

# git clone git://github.com/aurelia/loader
# git clone git://github.com/aurelia/loader-default
# git clone git://github.com/aurelia/task-queue
# git clone git://github.com/aurelia/logging
# git clone git://github.com/aurelia/logging-console
# git clone git://github.com/aurelia/history
# git clone git://github.com/aurelia/history-browser
# git clone git://github.com/aurelia/event-aggregator
# git clone git://github.com/aurelia/framework
# git clone git://github.com/aurelia/binding
# git clone git://github.com/aurelia/templating
# git clone git://github.com/aurelia/templating-binding
# git clone git://github.com/aurelia/templating-resources
# git clone git://github.com/aurelia/templating-router
# git clone git://github.com/aurelia/route-recognizer
# git clone git://github.com/aurelia/bootstrapper
# git clone git://github.com/aurelia/html-template-element

cd ..

cp -fR aurelia-latest-repos/metadata/src/* aurelia-latest/metadata
cp -fR aurelia-latest-repos/dependency-injection/src/* aurelia-latest/dependency-injection
cp -fR aurelia-latest-repos/router/src/* aurelia-latest/router
cp -fR aurelia-latest-repos/http-client/src/* aurelia-latest/http-client
cp -fR aurelia-latest-repos/path/src/* aurelia-latest/path
cp -fR aurelia-latest-repos/history/src/* aurelia-latest/history
cp -fR aurelia-latest-repos/event-aggregator/src/* aurelia-latest/event-aggregator
cp -fR aurelia-latest-repos/route-recognizer/src/* aurelia-latest/route-recognizer

rm -fR aurelia-latest-repos