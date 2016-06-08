'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');
var _s = require('underscore.string');
var glob = require('glob');

module.exports = yeoman.generators.Base.extend({
    prompting: function () {
        var done = this.async();

        var appname = this.name || path.basename(process.cwd());
        // Have Yeoman greet the user.
        this.log(yosay("Let's write some javascript!"));

        var prompts = [{
            type: 'input',
            name: 'appname',
            message: 'What do want to call it?',
            default: appname
        }, {
            type: 'input',
            name: 'version',
            message: 'What is the version number?',
            default: '0.0.1'
        }, {
            type: 'input',
            name: 'description',
            message: 'Can you describe this shit?',
            default: 'some nifty scriptfulness'
        }, {
            type: 'input',
            name: 'ghUsername',
            message: 'Github username?',
            default: 'blakgeek'
        }, {
            type: 'input',
            name: 'ghRepo',
            message: 'Github repo name?',
            default: appname
        }, {
            type: 'checkbox',
            name: 'features',
            message: 'Choose what you want to support:',
            choices: [{
                value: 'ng',
                name: 'Angular'
            }]
        }];

        this.prompt(prompts, function (props) {
            // To access props later use this.props.someOption;
            var self = this;
            var features = props.features;
            delete props.features;
            this.props = props;
            this.props.features = {};
            this.props.appname = _s.slugify(_s.humanize(props.appname));
            features.forEach(function (feature) {
                self.props.features[feature] = true
            });
            this.props.ghUrl = 'https://github.com/' + props.ghUsername + '/' + props.ghRepo;
            done();
        }.bind(this));
    },

    writing: function () {

        var generator = this;
        var props = _.merge({}, this.props, {
            _: _s
        });
        var templates = ['Gruntfile.js', 'package.json', 'bower.json'];

        // copy static files
        this.fs.copy(this.templatePath('**/*'), this.destinationPath());
        this.fs.copy(this.templatePath('**/.*'), this.destinationPath());

        // copy templates
        templates.forEach(function (file) {
            generator.fs.copyTpl(generator.templatePath(file), generator.destinationPath(file), props);
        });
    },

    install: function () {

        this.installDependencies();
        this.spawnCommandSync('git', ['init']);
        this.spawnCommandSync('git', ['remote', 'add', 'origin', this.props.ghUrl + '.git']);
        this.spawnCommandSync('git', ['add', '*']);
    }
});
