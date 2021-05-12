'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InfiniteScroll = function (_Component) {
  (0, _inherits3.default)(InfiniteScroll, _Component);

  function InfiniteScroll(props) {
    (0, _classCallCheck3.default)(this, InfiniteScroll);

    var _this = (0, _possibleConstructorReturn3.default)(this, (InfiniteScroll.__proto__ || (0, _getPrototypeOf2.default)(InfiniteScroll)).call(this, props));

    _this.scrollToPreviousPosition = function () {
      var el = _this.scrollComponent;
      var scrollTop = _this.props.threshold + 30;
      if (_this.props.useWindow) {
        setTimeout(function () {
          window.scrollTo(0, scrollTop);
        });
      } else {
        var parentNode = _this.getParentElement(el);
        if (parentNode) {
          setTimeout(function () {
            parentNode.scrollTo(0, scrollTop);
          });
        }
      }
    };

    _this.showLoadingbar = function () {
      var id = 'infinite-loader';
      var el = document.getElementById(id);
      if (el) {
        el.style.display = 'block';
        el.style.visibility = 'visible';
      }
    };

    _this.stopLoadingbar = function () {
      var id = 'infinite-loader';
      var el = document.getElementById(id);
      if (el) {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
      }
    };

    _this.style = { display: 'none', visibility: 'hidden' };
    _this.scrollListener = _this.scrollListener.bind(_this);
    _this.eventListenerOptions = _this.eventListenerOptions.bind(_this);
    _this.mousewheelListener = _this.mousewheelListener.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(InfiniteScroll, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.pageLoaded = this.props.pageStart;
      this.options = this.eventListenerOptions();
      // 26th Nov
      this.initializing = false;
      this.attachScrollListener();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.props.isReverse && this.loadMore) {
        var parentElement = this.getParentElement(this.scrollComponent);
        if (this.props.useWindow) {
          // const currentHeight = get(document, 'body.scrollHeight')
          //   ? get(document, 'body.scrollHeight')
          //   : get(document, 'documentElement.scrollHeight');
          // // const scrollTop = currentHeight - this.beforeScrollHeight + this.beforeScrollTop;
          // const scrollTop = this.props.threshold + 40;
          // window.scrollTo(0, scrollTop);
        } else {
            // parentElement.scrollTop =
            //   parentElement.scrollHeight -
            //   this.beforeScrollHeight +
            //   this.beforeScrollTop;
          }
      }
      // this.attachScrollListener();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.detachScrollListener();
      this.detachMousewheelListener();
    }

    // isWindowScrolledToBottom() {
    //   if (typeof window !== 'undefined') {
    //     const currentHeight = get(document, 'body.scrollHeight')
    //       ? get(document, 'body.scrollHeight')
    //       : get(document, 'documentElement.scrollHeight');
    //     // @var int scrollPoint
    //     const scrollPoint = window.pageYOffset + window.innerHeight;

    //     // check if we hit the bottom of the page
    //     if (scrollPoint >= currentHeight) {
    //       return true;
    //     }
    //   }
    //   return false;
    // }

  }, {
    key: 'isPassiveSupported',
    value: function isPassiveSupported() {
      var passive = false;

      var testOptions = {
        get passive() {
          passive = true;
        }
      };

      if (typeof document !== 'undefined') {
        try {
          document.addEventListener('test', null, testOptions);
          document.removeEventListener('test', null, testOptions);
        } catch (e) {
          // ignore
        }
      }

      return passive;
    }
  }, {
    key: 'eventListenerOptions',
    value: function eventListenerOptions() {
      var options = this.props.useCapture;

      if (this.isPassiveSupported()) {
        options = {
          useCapture: this.props.useCapture,
          passive: true
        };
      } else {
        options = {
          passive: false
        };
      }
      return options;
    }

    // Set a defaut loader for all your `InfiniteScroll` components

  }, {
    key: 'setDefaultLoader',
    value: function setDefaultLoader(loader) {
      this.defaultLoader = loader;
    }
  }, {
    key: 'detachMousewheelListener',
    value: function detachMousewheelListener() {
      var scrollEl = window;
      if (this.props.useWindow === false) {
        scrollEl = this.scrollComponent.parentNode;
      }
      if (scrollEl) {
        scrollEl.removeEventListener('mousewheel', this.mousewheelListener, this.options ? this.options : this.props.useCapture);
      }
    }
  }, {
    key: 'detachScrollListener',
    value: function detachScrollListener() {
      var scrollEl = window;
      if (this.props.useWindow === false) {
        scrollEl = this.getParentElement(this.scrollComponent);
      }
      if (scrollEl) {
        scrollEl.removeEventListener('scroll', this.scrollListener, this.options ? this.options : this.props.useCapture);
        scrollEl.removeEventListener('resize', this.scrollListener, this.options ? this.options : this.props.useCapture);
      }
    }
  }, {
    key: 'getParentElement',
    value: function getParentElement(el) {
      var scrollParent = this.props.getScrollParent && this.props.getScrollParent();
      if (scrollParent != null) {
        return scrollParent;
      }
      return el && el.parentNode;
    }
  }, {
    key: 'filterProps',
    value: function filterProps(props) {
      return props;
    }
  }, {
    key: 'attachScrollListener',
    value: function attachScrollListener() {
      var parentElement = this.getParentElement(this.scrollComponent);

      // if (!this.props.hasMore || !parentElement) {
      //   return;
      // }

      if (!parentElement) {
        return;
      }

      var scrollEl = window;
      if (this.props.useWindow === false) {
        scrollEl = parentElement;
      }
      if (scrollEl) {
        scrollEl.addEventListener('mousewheel', this.mousewheelListener, this.options ? this.options : this.props.useCapture);
        scrollEl.addEventListener('scroll', this.scrollListener, this.options ? this.options : this.props.useCapture);
        scrollEl.addEventListener('resize', this.scrollListener, this.options ? this.options : this.props.useCapture);
      }

      if (this.props.initialLoad) {
        this.scrollListener();
      }
    }
  }, {
    key: 'mousewheelListener',
    value: function mousewheelListener(e) {
      // Prevents Chrome hangups
      // See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
      if (e.deltaY === 1 && !this.isPassiveSupported()) {
        e.preventDefault();
      }
    }
  }, {
    key: 'scrollListener',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var el, scrollEl, parentNode, scrollToPreviousPosition, offset, doc, scrollTop;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                el = this.scrollComponent;
                scrollEl = window;
                parentNode = this.getParentElement(el);
                scrollToPreviousPosition = this.scrollToPreviousPosition;
                // In case of chat.. check if it has reached to bottom scroll..

                if (!this.initializing) {
                  _context.next = 10;
                  break;
                }

                if (!this.isWindowScrolledToBottom()) {
                  _context.next = 9;
                  break;
                }

                this.initializing = false;
                _context.next = 10;
                break;

              case 9:
                return _context.abrupt('return');

              case 10:
                offset = void 0;

                if (this.props.useWindow) {
                  doc = document.documentElement || document.body.parentNode || document.body;
                  scrollTop = scrollEl.pageYOffset !== undefined ? scrollEl.pageYOffset : doc.scrollTop;

                  if (this.props.isReverse) {
                    offset = scrollTop;
                  } else {
                    offset = this.calculateOffset(el, scrollTop);
                  }
                } else if (this.props.isReverse) {
                  offset = parentNode.scrollTop;
                } else {
                  offset = el.scrollHeight - parentNode.scrollTop - parentNode.clientHeight;
                }

                // Here we make sure the element is visible as well as checking the offset

                if (!(offset < Number(this.props.threshold) && el && el.offsetParent !== null)) {
                  _context.next = 25;
                  break;
                }

                if (!(!this.props.hasMore || this.loadingInProgress)) {
                  _context.next = 15;
                  break;
                }

                return _context.abrupt('return');

              case 15:
                this.loadingInProgress = true;
                // this.detachScrollListener();
                // Show loading bar..
                this.showLoadingbar();
                if (this.props.useWindow) {
                  this.beforeScrollHeight = (0, _get2.default)(document, 'body.scrollHeight') ? (0, _get2.default)(document, 'body.scrollHeight') : (0, _get2.default)(document, 'documentElement.scrollHeight');
                  this.beforeScrollTop = window.pageYOffset;
                } else {
                  this.beforeScrollHeight = parentNode.scrollHeight;
                  this.beforeScrollTop = parentNode.scrollTop;
                }

                // Call loadMore after detachScrollListener to allow for non-async loadMore functions

                if (!(typeof this.props.loadMore === 'function')) {
                  _context.next = 24;
                  break;
                }

                this.loadMore = true;
                _context.next = 22;
                return this.props.loadMore(this.pageLoaded += 1);

              case 22:
                if (this.props.isReverse) {
                  scrollToPreviousPosition();
                }

                this.stopLoadingbar();

              case 24:
                this.loadingInProgress = false;

              case 25:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function scrollListener() {
        return _ref.apply(this, arguments);
      }

      return scrollListener;
    }()
  }, {
    key: 'calculateOffset',
    value: function calculateOffset(el, scrollTop) {
      if (!el) {
        return 0;
      }

      return this.calculateTopPosition(el) + (el.offsetHeight - scrollTop - window.innerHeight);
    }
  }, {
    key: 'calculateTopPosition',
    value: function calculateTopPosition(el) {
      if (!el) {
        return 0;
      }
      return el.offsetTop + this.calculateTopPosition(el.offsetParent);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var renderProps = this.filterProps(this.props);
      var children = renderProps.children,
          element = renderProps.element,
          hasMore = renderProps.hasMore,
          initialLoad = renderProps.initialLoad,
          isReverse = renderProps.isReverse,
          loader = renderProps.loader,
          loadMore = renderProps.loadMore,
          pageStart = renderProps.pageStart,
          ref = renderProps.ref,
          threshold = renderProps.threshold,
          useCapture = renderProps.useCapture,
          useWindow = renderProps.useWindow,
          getScrollParent = renderProps.getScrollParent,
          props = (0, _objectWithoutProperties3.default)(renderProps, ['children', 'element', 'hasMore', 'initialLoad', 'isReverse', 'loader', 'loadMore', 'pageStart', 'ref', 'threshold', 'useCapture', 'useWindow', 'getScrollParent']);


      props.ref = function (node) {
        _this2.scrollComponent = node;
        if (ref) {
          ref(node);
        }
      };

      var childrenArray = [children];
      if (loader) {
        var newLoader = _react2.default.createElement(
          'div',
          { style: this.style, key: 0, id: 'infinite-loader' },
          loader
        );
        isReverse ? childrenArray.unshift(newLoader) : childrenArray.push(newLoader);
      } else if (this.defaultLoader) {
        isReverse ? childrenArray.unshift(this.defaultLoader) : childrenArray.push(this.defaultLoader);
      }

      return _react2.default.createElement(element, props, childrenArray);
    }
  }]);
  return InfiniteScroll;
}(_react.Component); /* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable lodash/prefer-lodash-typecheck */
/* eslint-disable lodash/prefer-get */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable getter-return */


InfiniteScroll.propTypes = {
  children: _propTypes2.default.node.isRequired,
  element: _propTypes2.default.node,
  hasMore: _propTypes2.default.bool,
  initialLoad: _propTypes2.default.bool,
  isReverse: _propTypes2.default.bool,
  loader: _propTypes2.default.node,
  loadMore: _propTypes2.default.func.isRequired,
  pageStart: _propTypes2.default.number,
  ref: _propTypes2.default.func,
  getScrollParent: _propTypes2.default.func,
  threshold: _propTypes2.default.number,
  useCapture: _propTypes2.default.bool,
  useWindow: _propTypes2.default.bool
};
InfiniteScroll.defaultProps = {
  element: 'div',
  hasMore: false,
  initialLoad: true,
  pageStart: 0,
  ref: null,
  threshold: 250,
  useWindow: true,
  isReverse: false,
  useCapture: false,
  loader: null,
  getScrollParent: null
};
exports.default = InfiniteScroll;
module.exports = exports['default'];
