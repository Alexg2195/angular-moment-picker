angular.module("momentPicker").run(["$templateCache", function($templateCache) {$templateCache.put("momentPicker.html","<div ng-switch=\"view\" class=\"moment-picker\">\n    <div ng-switch-when=\"year\">\n        <table>\n            <thead>\n            <tr>\n                <th ng-click=\"prev(10)\">&lsaquo;</th>\n                <th colspan=\"5\" class=\"switch\">\n                    {{years[0]|moment:\'YYYY\'}} - {{years[years.length-1]|moment:\'YYYY\'}}\n                </th>\n                <th ng-click=\"next(10)\">&rsaquo;</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr>\n                <td colspan=\"7\">\n          <span ng-class=\"{\'active\':isSameYear(year),\'now\':isNow(year), \'after\':isAfter(year),\'before\':isBefore(year)}\"\n                ng-repeat=\"year in years\"\n                ng-click=\"setDate(year)\">{{year|moment:\'YYYY\'}}</span>\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n    <div ng-switch-when=\"month\">\n        <table>\n            <thead>\n            <tr>\n                <th ng-click=\"prev()\">&lsaquo;</th>\n                <th colspan=\"5\" class=\"switch\" ng-click=\"setView(\'year\')\">{{moment|moment:\'MMMM YYYY\'}}</th>\n                <th ng-click=\"next()\">&rsaquo;</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr>\n                <td colspan=\"7\">\n          <span ng-repeat=\"month in months\"\n                ng-class=\"{\'active\':isSameMonth(month),\'after\':isAfter(month),\'before\':isBefore(month),\'now\':isNow(month)}\"\n                ng-click=\"setDate(month)\"\n                  >{{month|moment:\'MMM\'}}\n          </span>\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n    <div ng-switch-when=\"date\">\n        <table>\n            <thead>\n            <tr>\n                <th ng-click=\"prev()\">&lsaquo;</th>\n                <th colspan=\"5\" class=\"switch\" ng-click=\"setView(\'month\')\">{{moment|moment:\'MMMM YYYY\'}}</th>\n                <th ng-click=\"next()\">&rsaquo;</th>\n            </tr>\n            <tr>\n                <th ng-repeat=\"day in weekdays\" style=\"overflow: hidden\">{{day|moment:\'ddd\'}}</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr ng-repeat=\"week in weeks\">\n                <td ng-repeat=\"day in week\">\n          <span\n                  ng-class=\"{\'now\':isNow(day),\'active\':isSameDay(day),\'disabled\':(day.month()!=moment.month()),\'after\':isAfter(day),\'before\':isBefore(day)}\"\n                  ng-click=\"setDate(day)\">{{day|moment:\'DD\'}}</span>\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n    <div ng-switch-when=\"hours\">\n        <table>\n            <thead>\n            <tr>\n                <th ng-click=\"prev()\">&lsaquo;</th>\n                <th colspan=\"5\" class=\"switch\" ng-click=\"setView(\'date\')\" ng-bind=\"moment|moment:\'DD MMMM YYYY\'\"></th>\n                <th ng-click=\"next()\">&rsaquo;</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr>\n                <td colspan=\"7\">\n          <span ng-repeat=\"hour in hours\"\n                ng-class=\"{\'now\':isNow(hour),\'active\':isSameHour(hour), \'after\':isAfter(hour),\'before\':isBefore(hour)}\"\n                ng-click=\"setDate(hour)\">\n            {{hour|moment:\'HH:mm\'}}\n          </span>\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n    <div ng-switch-when=\"minutes\">\n        <table>\n            <thead>\n            <tr>\n                <th ng-click=\"prev()\">&lsaquo;</th>\n                <th colspan=\"5\" class=\"switch\" ng-click=\"setView(\'hours\')\" ng-bind=\"moment|moment:\'HH:mm - DD MMM YYYY\'\"></th>\n                <th ng-click=\"next()\">&rsaquo;</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr>\n                <td colspan=\"7\">\n          <span ng-repeat=\"minute in minutes\"\n                ng-class=\"{active:isSameMinutes(minute),\'now\':isNow(minute), \'after\':isAfter(minute),\'before\':isBefore(minute)}\"\n                ng-click=\"setDate(minute)\"\n                ng-bind=\"minute|moment:\'HH:mm\'\"></span>\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n</div>\n");}]);