/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable lodash/prefer-lodash-typecheck */
/* eslint-disable lodash/prefer-get */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable getter-return */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

export default class InfiniteScroll extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    element: PropTypes.node,
    hasMore: PropTypes.bool,
    initialLoad: PropTypes.bool,
    isReverse: PropTypes.bool,
    loader: PropTypes.node,
    loadMore: PropTypes.func.isRequired,
    pageStart: PropTypes.number,
    ref: PropTypes.func,
    getScrollParent: PropTypes.func,
    threshold: PropTypes.number,
    useCapture: PropTypes.bool,
    useWindow: PropTypes.bool
  };

  static defaultProps = {
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

  constructor(props) {
    super(props);
    this.scrollListener = this.scrollListener.bind(this);
    this.eventListenerOptions = this.eventListenerOptions.bind(this);
    this.mousewheelListener = this.mousewheelListener.bind(this);
  }

  componentDidMount() {
    this.pageLoaded = this.props.pageStart;
    this.options = this.eventListenerOptions();
    // 26th Nov
    this.initializing = false;
    this.attachScrollListener();
  }

  componentDidUpdate() {
    if (this.props.isReverse && this.loadMore) {
      const parentElement = this.getParentElement(this.scrollComponent);
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

  componentWillUnmount() {
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

  isPassiveSupported() {
    let passive = false;

    const testOptions = {
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

  eventListenerOptions() {
    let options = this.props.useCapture;

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
  setDefaultLoader(loader) {
    this.defaultLoader = loader;
  }

  detachMousewheelListener() {
    let scrollEl = window;
    if (this.props.useWindow === false) {
      scrollEl = this.scrollComponent.parentNode;
    }
    if (scrollEl) {
      scrollEl.removeEventListener(
        'mousewheel',
        this.mousewheelListener,
        this.options ? this.options : this.props.useCapture
      );
    }
  }

  detachScrollListener() {
    let scrollEl = window;
    if (this.props.useWindow === false) {
      scrollEl = this.getParentElement(this.scrollComponent);
    }
    if (scrollEl) {
      scrollEl.removeEventListener(
        'scroll',
        this.scrollListener,
        this.options ? this.options : this.props.useCapture
      );
      scrollEl.removeEventListener(
        'resize',
        this.scrollListener,
        this.options ? this.options : this.props.useCapture
      );
    }
  }

  getParentElement(el) {
    const scrollParent =
      this.props.getScrollParent && this.props.getScrollParent();
    if (scrollParent != null) {
      return scrollParent;
    }
    return el && el.parentNode;
  }

  filterProps(props) {
    return props;
  }

  attachScrollListener() {
    const parentElement = this.getParentElement(this.scrollComponent);

    // if (!this.props.hasMore || !parentElement) {
    //   return;
    // }

    if (!parentElement) {
      return;
    }

    let scrollEl = window;
    if (this.props.useWindow === false) {
      scrollEl = parentElement;
    }
    if (scrollEl) {
      scrollEl.addEventListener(
        'mousewheel',
        this.mousewheelListener,
        this.options ? this.options : this.props.useCapture
      );
      scrollEl.addEventListener(
        'scroll',
        this.scrollListener,
        this.options ? this.options : this.props.useCapture
      );
      scrollEl.addEventListener(
        'resize',
        this.scrollListener,
        this.options ? this.options : this.props.useCapture
      );
    }

    if (this.props.initialLoad) {
      this.scrollListener();
    }
  }

  mousewheelListener(e) {
    // Prevents Chrome hangups
    // See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
    if (e.deltaY === 1 && !this.isPassiveSupported()) {
      e.preventDefault();
    }
  }

  async scrollListener() {
    const el = this.scrollComponent;
    const scrollEl = window;
    const parentNode = this.getParentElement(el);
    const { scrollToPreviousPosition } = this;
    // In case of chat.. check if it has reached to bottom scroll..
    if (this.initializing) {
      // Check if scroll
      if (this.isWindowScrolledToBottom()) {
        this.initializing = false;
      } else {
        // Dont call unless its initialized..
        return;
      }
    }

    let offset;
    if (this.props.useWindow) {
      const doc =
        document.documentElement || document.body.parentNode || document.body;
      const scrollTop =
        scrollEl.pageYOffset !== undefined
          ? scrollEl.pageYOffset
          : doc.scrollTop;
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
    if (
      offset < Number(this.props.threshold) &&
      el &&
      el.offsetParent !== null
    ) {
      if (!this.props.hasMore || this.loadingInProgress) {
        return;
      }
      this.loadingInProgress = true;
      // this.detachScrollListener();
      // Show loading bar..
      this.showLoadingbar();
      if (this.props.useWindow) {
        this.beforeScrollHeight = get(document, 'body.scrollHeight')
          ? get(document, 'body.scrollHeight')
          : get(document, 'documentElement.scrollHeight');
        this.beforeScrollTop = window.pageYOffset;
      } else {
        this.beforeScrollHeight = parentNode.scrollHeight;
        this.beforeScrollTop = parentNode.scrollTop;
      }

      // Call loadMore after detachScrollListener to allow for non-async loadMore functions
      if (typeof this.props.loadMore === 'function') {
        this.loadMore = true;
        await this.props.loadMore((this.pageLoaded += 1));
        if (this.props.isReverse) {
          scrollToPreviousPosition();
        }

        this.stopLoadingbar();
      }
      this.loadingInProgress = false;
    }
  }

  scrollToPreviousPosition = () => {
    const el = this.scrollComponent;
    const scrollTop = this.props.threshold + 30;
    if (this.props.useWindow) {
      setTimeout(() => {
        window.scrollTo(0, scrollTop);
      });
    } else {
      const parentNode = this.getParentElement(el);
      if (parentNode) {
        setTimeout(() => {
          parentNode.scrollTo(0, scrollTop);
        });
      }
    }
  };

  showLoadingbar = () => {
    const id = 'infinite-loader';
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'block';
      el.style.visibility = 'visible';
    }
  };

  stopLoadingbar = () => {
    const id = 'infinite-loader';
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
    }
  };

  calculateOffset(el, scrollTop) {
    if (!el) {
      return 0;
    }

    return (
      this.calculateTopPosition(el) +
      (el.offsetHeight - scrollTop - window.innerHeight)
    );
  }

  calculateTopPosition(el) {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }

  render() {
    const renderProps = this.filterProps(this.props);
    const {
      children,
      element,
      hasMore,
      initialLoad,
      isReverse,
      loader,
      loadMore,
      pageStart,
      ref,
      threshold,
      useCapture,
      useWindow,
      getScrollParent,
      ...props
    } = renderProps;

    props.ref = node => {
      this.scrollComponent = node;
      if (ref) {
        ref(node);
      }
    };

    const childrenArray = [children];
    if (hasMore) {
      if (loader) {
        const newLoader = (
          <div
            style={{ display: 'none', visibility: 'hidden' }}
            key={0}
            id="infinite-loader"
          >
            {loader}
          </div>
        );
        isReverse
          ? childrenArray.unshift(newLoader)
          : childrenArray.push(newLoader);
      } else if (this.defaultLoader) {
        isReverse
          ? childrenArray.unshift(this.defaultLoader)
          : childrenArray.push(this.defaultLoader);
      }
    }
    return React.createElement(element, props, childrenArray);
  }
}
