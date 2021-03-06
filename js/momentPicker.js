'use strict';

angular.module('momentPicker')
  .constant('momentPickerConfig', {
    template: 'momentPicker.html',
    view: 'month',
    views: ['year', 'month', 'date', 'hours', 'minutes'],
    step: 5,
    local: false
  })
  .filter('moment', ['moment', function (moment) {
    return function (input, format) {
      if (input) {
        if (moment.isMoment(input)) {
          return input.format(format);
        }
        else {
          return moment(input).format(format);
        }
      }
      else {
        return '';
      }
    }
  }])

  .filter('momentUTC', ['moment', function (moment) {
    return function (input, format) {
      if (input) {
        if (moment.isMoment(input)) {
          var m = moment(input).utc();
          return m.format(format);
        }
        else {
          return moment.utc(input).format(format);
        }
      }
      else {
        return '';
      }
    }
  }])
  .filter('momentLocal', ['moment', function (moment) {
    return function (input, format) {
      if (input) {
        if (moment.isMoment(input)) {
          var m = moment(input).local();
          return m.format(format);
        }
        else {
          return moment(input).local().format(format);
        }
      }
      else {
        return '';
      }
    }
  }])
  .directive('momentPicker', ['momentPickerConfig', 'momentUtils',
    function momentPickerDirective(momentPickerConfig, momentUtils) {

      //noinspection JSUnusedLocalSymbols
      return {
        // this is a bug ?
        require: '?ngModel',
        template: '<div ng-include="template"></div>',
        restrict: 'AE',
        scope: {
          model: '=momentPicker',
          after: '=?',
          before: '=?',
          minView: '@?',
          maxView: '@?',
          minMoment: '=?',
          maxMoment: '=?',
          local: '=?'
        },
        link: function (scope, element, attrs, ngModel) {
          scope.local = scope.local || momentPickerConfig.local;
          var arrowClick = false;
          scope.moment = newMoment(scope.model);
          scope.minView = scope.minView || 'year';
          scope.maxView = scope.maxView || 'date';
          scope.views = momentPickerConfig.views.concat();

          scope.view = attrs.view || momentPickerConfig.view;
          scope.now = newMoment();
          scope.template = attrs.template || momentPickerConfig.template;

          var step = parseInt(attrs.step || momentPickerConfig.step, 10);
          var partial = !!attrs.partial;

          //if ngModel, we can add min and max validators
          if (ngModel) {
            if (angular.isDefined(scope.minMoment)) {
              var minVal;
              ngModel.$validators.min = function (value) {
                return !momentUtils.isValidDate(value) || angular.isUndefined(minVal) || value.isSame(minVal) || value.isAfter(minVal);
              };
              scope.$watch('minMoment', function (val) {
                minVal = val;
                ngModel.$validate();
              });
            }

            if (angular.isDefined(scope.maxMoment)) {
              var maxVal;
              ngModel.$validators.max = function (value) {
                return !momentUtils.isValidDate(value) || angular.isUndefined(maxVal) || value.isSame(maxVal) || value.isBefore(maxVal);
              };
              scope.$watch('maxMoment', function (val) {
                maxVal = val;
                ngModel.$validate();
              });
            }
          }
          //end min, max date validator

          scope.views = scope.views.slice(
            scope.views.indexOf(scope.maxView || 'year'),
            scope.views.indexOf(scope.minView || 'minutes') + 1
          );

          if (scope.views.length === 1 || scope.views.indexOf(scope.view) === -1) {
            scope.view = scope.views[0];
          }

          scope.setView = function (nextView) {
            if (scope.views.indexOf(nextView) !== -1) {
              scope.view = nextView;
            }
          };

          scope.setDate = function (date) {
            if (attrs.disabled) {
              return;
            }
            scope.moment = date;
            // change next view
            var nextView = scope.views[scope.views.indexOf(scope.view) + 1];
            if ((!nextView || partial) || scope.model) {

              scope.model = scope.moment;
              //scope.model = new Date(scope.model || date);
              //if ngModel , setViewValue and trigger ng-change, etc...
              if (ngModel) {
                ngModel.$setViewValue(scope.moment);
              }

              var view = partial ? 'minutes' : scope.view;
              //noinspection FallThroughInSwitchStatementJS
              switch (view) {
                case 'minutes':
                  scope.model.minute(scope.moment.minute());
                /*falls through*/
                case 'hours':
                  scope.model.hour(scope.moment.hour());
                /*falls through*/
                case 'date':
                  scope.model.day(scope.moment.day());
                /*falls through*/
                case 'month':
                  scope.model.month(scope.moment.month());
                /*falls through*/
                case 'year':
                  scope.model.year(scope.moment.year());
              }
              scope.$emit('setDate', scope.model, scope.view);
            }

            if (nextView) {
              scope.setView(nextView);
            }

            if (!nextView && attrs.autoClose === 'true') {
              element.addClass('hidden');
              scope.$emit('hidePicker');
            }
          };

          function update() {
            var view = scope.view;

            if (scope.model && !arrowClick) {
              scope.moment = newMoment(scope.model);
              arrowClick = false;
            }
            var date = scope.moment;

            switch (view) {
              case 'year':
                scope.years = momentUtils.getVisibleYears(date, scope.local);
                break;
              case 'month':
                scope.months = momentUtils.getVisibleMonths(date, scope.local);
                break;
              case 'date':
                scope.weekdays = scope.weekdays || momentUtils.getDaysOfWeek(null, scope.local);
                scope.weeks = momentUtils.getVisibleWeeks(date, scope.local);
                break;
              case 'hours':
                scope.hours = momentUtils.getVisibleHours(date, scope.local);
                break;
              case 'minutes':
                scope.minutes = momentUtils.getVisibleMinutes(date, step, scope.local);
                break;
            }
          }

          function watch() {
            if (scope.view !== 'date') {
              return scope.view;
            }
            return scope.moment ? scope.moment.month() : null;
          }

          scope.$watch(watch, update);

          scope.next = function (delta) {
            var date = scope.moment;
            delta = delta || 1;
            switch (scope.view) {
              case 'year':
                date.add(delta, 'years');
                break;
              case 'month':
                date.add(delta, 'months');
                break;
              case 'date':
                date.add(delta, 'months');
                break;
              case 'hours':
                date.add(delta, 'days');
                break;
              case 'minutes':
                date.add(delta, 'hours');
                break;
            }
            arrowClick = true;
            update();
          };

          scope.prev = function (delta) {
            return scope.next(-delta || -1);
          };

          scope.isAfter = function (date) {
            return scope.after && momentUtils.isAfter(date, scope.after, scope.local);
          };

          scope.isBefore = function (date) {
            return scope.before && momentUtils.isBefore(date, scope.before, scope.local);
          };

          scope.isSameMonth = function (date) {
            return momentUtils.isSameMonth(scope.model, date, scope.local);
          };

          scope.isSameYear = function (date) {
            return momentUtils.isSameYear(scope.model, date, scope.local);
          };

          scope.isSameDay = function (date) {
            return momentUtils.isSameDay(scope.model, date, scope.local);
          };

          scope.isSameHour = function (date) {
            return momentUtils.isSameHour(scope.model, date, scope.local);
          };

          scope.isSameMinutes = function (date) {
            return momentUtils.isSameMinutes(scope.model, date, scope.local);
          };

          scope.isNow = function (date) {
            var is = true;
            var now = scope.now;
            //noinspection FallThroughInSwitchStatementJS
            switch (scope.view) {
              case 'minutes':
                is &= ~~(date.minutes() / step) === ~~(now.minutes() / step);
              /*falls through*/
              case 'hours':
                is &= date.hours() === now.hours();
              /*falls through*/
              case 'date':
                is &= date.date() === now.date();
              /*falls through*/
              case 'month':
                is &= date.month() === now.month();
              /*falls through*/
              case 'year':
                is &= date.year() === now.year();
            }
            return is;
          };

          function newMoment(options) {
            return momentUtils.createMoment(options, scope.local);
          }
        }
      };
    }]);
