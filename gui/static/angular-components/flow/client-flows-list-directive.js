'use strict';

goog.provide('grrUi.flow.clientFlowsListDirective.ClientFlowsListController');
goog.provide('grrUi.flow.clientFlowsListDirective.ClientFlowsListDirective');

goog.scope(function() {



/**
 * Controller for FlowsListDirective.
 *
 * @constructor
 * @param {!angular.Scope} $scope
 * @param {!angular.$timeout} $timeout
 * @param {!grrUi.core.apiService.ApiService} grrApiService
 * @ngInject
 */
grrUi.flow.clientFlowsListDirective.ClientFlowsListController = function(
    $scope, $timeout, grrApiService) {
  /** @private {!angular.Scope} */
  this.scope_ = $scope;

  /** @private {!angular.$timeout} */
  this.timeout_ = $timeout;

  /** @private {!grrUi.core.apiService.ApiService} */
  this.grrApiService_ = grrApiService;

  /** @type {?string} */
  this.flowsUrl;

  /**
   * This variable is bound to grr-flows-list's trigger-update attribute
   * and therefore is set by that directive to a function that triggers
   * list update.
   * @export {function()}
   */
  this.triggerUpdate;

  this.scope_.$watch('clientId', this.onClientIdChange_.bind(this));
};
var ClientFlowsListController =
    grrUi.flow.clientFlowsListDirective.ClientFlowsListController;


/**
 * Handles changes of clientId binding.
 *
 * @param {?string} newValue New binding value.
 * @private
 */
ClientFlowsListController.prototype.onClientIdChange_ = function(newValue) {
  if (angular.isString(newValue)) {
    var components = newValue.split('/');
    var basename = components[components.length - 1];
    this.flowsUrl = '/clients/' + basename + '/flows';
  } else {
    this.flowsUrl = null;
  }
};

/**
 * Handles clicks on 'Cancel Flow' button.
 *
 * @export
 */
ClientFlowsListController.prototype.cancelButtonClicked = function() {
  var components = this.scope_['selectedFlowUrn'].split('/');
  var cancelUrl = this.flowsUrl + '/' + components[components.length - 1] +
      '/actions/cancel';

  this.grrApiService_.post(cancelUrl, {}).then(function() {
    this.triggerUpdate();

    // This will force all the directives that depend on selectedFlowUrn
    // binding to refresh.
    var urn = this.scope_['selectedFlowUrn'];
    this.scope_['selectedFlowUrn'] = undefined;
    this.timeout_(function() {
      this.scope_['selectedFlowUrn'] = urn;
    }.bind(this), 0);
  }.bind(this));
};


/**
 * FlowsListDirective definition.

 * @return {angular.Directive} Directive definition object.
 */
grrUi.flow.clientFlowsListDirective.ClientFlowsListDirective = function() {
  return {
    scope: {
      clientId: '=',
      selectedFlowUrn: '=?'
    },
    restrict: 'E',
    templateUrl: '/static/angular-components/flow/client-flows-list.html',
    controller: ClientFlowsListController,
    controllerAs: 'controller'
  };
};


/**
 * Directive's name in Angular.
 *
 * @const
 * @export
 */
grrUi.flow.clientFlowsListDirective.ClientFlowsListDirective
    .directive_name = 'grrClientFlowsList';



});  // goog.scope
