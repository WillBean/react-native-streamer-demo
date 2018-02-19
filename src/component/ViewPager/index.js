// 一下为ViewPagerDataSource
/* eslint-disable */
function defaultGetPageData(dataBlob, pageID) {
  return dataBlob[pageID];
}

class ViewPagerDataSource {
  constructor(params) {
    this._getPageData = params.getPageData || defaultGetPageData;
    this._pageHasChanged = params.pageHasChanged;

    this.pageIdentities = [];
  }

  cloneWithPages(dataBlob, pageIdentities) {
    const newSource = new ViewPagerDataSource({
      getPageData: this._getPageData,
      pageHasChanged: this._pageHasChanged,
    });

    newSource._dataBlob = dataBlob;

    if (pageIdentities) {
      newSource.pageIdentities = pageIdentities;
    } else {
      newSource.pageIdentities = Object.keys(dataBlob);
    }

    newSource._cachedPageCount = newSource.pageIdentities.length;
    newSource._calculateDirtyPages(
      this._dataBlob,
      this.pageIdentities,
    );
    return newSource;
  }

  getPageCount() {
    return this._cachedPageCount;
  }

  /**
   * Returns if the row is dirtied and needs to be rerendered
   */
  pageShouldUpdate(pageIndex) {
    const needsUpdate = this._dirtyPages[pageIndex];
    //    warning(needsUpdate !== undefined,
    //  'missing dirtyBit for section, page: ' + pageIndex);
    return needsUpdate;
  }

  /**
   * Gets the data required to render the page
   */
  getPageData(pageIndex) {
    if (!this.getPageData) {
      return null;
    }
    const pageID = this.pageIdentities[pageIndex];
    //    warning(pageID !== undefined,
    //      'renderPage called on invalid section: ' + pageID);
    return this._getPageData(this._dataBlob, pageID);
  }

  /**
   * Private members and methods.
   */

  _calculateDirtyPages(prevDataBlob, prevPageIDs) {
    // construct a hashmap of the existing (old) id arrays
    const prevPagesHash = keyedDictionaryFromArray(prevPageIDs);
    this._dirtyPages = [];

    let dirty;
    for (let sIndex = 0; sIndex < this.pageIdentities.length; sIndex++) {
      const pageID = this.pageIdentities[sIndex];
      dirty = !prevPagesHash[pageID];
      const pageHasChanged = this._pageHasChanged;
      if (!dirty && pageHasChanged) {
        dirty = pageHasChanged(
          this._getPageData(prevDataBlob, pageID),
          this._getPageData(this._dataBlob, pageID),
        );
      }
      this._dirtyPages.push(!!dirty);
    }
  }
}

function keyedDictionaryFromArray(arr) {
  if (arr.length === 0) {
    return {};
  }
  const result = {};
  for (let ii = 0; ii < arr.length; ii++) {
    const key = arr[ii];
    //    warning(!result[key], 'Value appears more than once in array: ' + key);
    result[key] = true;
  }
  return result;
}

// 以下为ViewPager

const React = require('react');

import PropTypes from 'prop-types';

const ReactNative = require('react-native');

const {
  Dimensions,
  View,
  PanResponder,
  Animated,
} = ReactNative;

const StaticRenderer = require('react-native/Libraries/Components/StaticRenderer');
const TimerMixin = require('react-timer-mixin');

const deviceWidth = Dimensions.get('window').width;

class ViewPager extends TimerMixin(React.Component) {
  static defaultProps = {
    DataSource: ViewPagerDataSource,
    isLoop: false,
    locked: false,
    animation(animate, toValue, gs) {
      return Animated.spring(
        animate,
        {
          toValue,
          friction: 10,
          tension: 50,
        },
      );
    },
  }

  static propTypes = {
    ...View.propTypes,
    dataSource: PropTypes.instanceOf(ViewPagerDataSource).isRequired,
    renderPage: PropTypes.func.isRequired,
    onChangePage: PropTypes.func,
    renderPageIndicator: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.bool,
    ]),
    isLoop: PropTypes.bool,
    locked: PropTypes.bool,
    autoPlay: PropTypes.bool,
    animation: PropTypes.func,
    initialPage: PropTypes.number,
  }

  fling: false

  constructor(props) {
    super(props);
    this.setState({
      currentPage: 0,
      viewWidth: 0,
      scrollValue: new Animated.Value(0),
    })
  }

  componentWillMount() {
    this.childIndex = 0;

    const release = (e, gestureState) => {
      let relativeGestureDistance = gestureState.dx / deviceWidth,
        // lastPageIndex = this.props.children.length - 1,
        vx = gestureState.vx;

      let step = 0;
      if (relativeGestureDistance < -0.5 || (relativeGestureDistance < 0 && vx <= -1e-6)) {
        step = 1;
      } else if (relativeGestureDistance > 0.5 || (relativeGestureDistance > 0 && vx >= 1e-6)) {
        step = -1;
      }

      this.props.hasTouch && this.props.hasTouch(false);

      this.movePage(step, gestureState);
    };

    this._panResponder = PanResponder.create({
      // Claim responder if it's a horizontal pan
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if (/* (gestureState.moveX <= this.props.edgeHitWidth ||
             gestureState.moveX >= deviceWidth - this.props.edgeHitWidth) && */
            this.props.locked !== true && !this.fling) {
            this.props.hasTouch && this.props.hasTouch(true);
            return true;
          }
        }
      },

      // Touch is released, scroll to the one that you're closest to
      onPanResponderRelease: release,
      onPanResponderTerminate: release,

      // Dragging, move the view with the touch
      onPanResponderMove: (e, gestureState) => {
        const dataSource = this.props.dataSource;
        const pageIDs = dataSource.pageIdentities;
        if (pageIDs.length <= 1) {
          return false;
        }
        const dx = gestureState.dx;
        const offsetX = -dx / this.state.viewWidth + this.childIndex;
        this.state.scrollValue.setValue(offsetX);
      },
    });

    if (this.props.isLoop) {
      this.childIndex = 1;
      this.state.scrollValue.setValue(1);
    }
    if (this.props.initialPage) {
      const initialPage = Number(this.props.initialPage);
      if (initialPage > 0) {
        this.goToPage(initialPage, false);
      }
    }
  }

  componentDidMount() {
    if (this.props.autoPlay) {
      this._startAutoPlay();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.autoPlay) {
      this._startAutoPlay();
    } else if (this._autoPlayer) {
      this.clearInterval(this._autoPlayer);
      this._autoPlayer = null;
    }

    if (nextProps.dataSource) {
      const maxPage = nextProps.dataSource.getPageCount() - 1;
      const constrainedPage = Math.max(0, Math.min(this.state.currentPage, maxPage));
      this.setState({
        currentPage: constrainedPage,
      });

      if (!nextProps.isLoop) {
        this.state.scrollValue.setValue(constrainedPage > 0 ? 1 : 0);
      }

      // this.childIndex = Math.min(this.childIndex, constrainedPage); // 此处会导致初次滑动的时候位置出错
      this.fling = false;
    }
  }

  _startAutoPlay() {
    if (!this._autoPlayer) {
      this._autoPlayer = this.setInterval(
        () => { this.movePage(1); },
        5000,
      );
    }
  }

  goToPage(pageNumber, animate = true) {
    const pageCount = this.props.dataSource.getPageCount();
    if (pageNumber < 0 || pageNumber >= pageCount) {
      console.error('Invalid page number: ', pageNumber);
      return;
    }

    const step = pageNumber - this.state.currentPage;
    this.movePage(step, null, animate);
  }

  movePage(step, gs, animate = true) {
    const pageCount = this.props.dataSource.getPageCount();
    let pageNumber = this.state.currentPage + step;
    if (this.props.isLoop) {
      pageNumber = pageCount == 0 ? pageNumber = 0 : ((pageNumber + pageCount) % pageCount);
    } else {
      pageNumber = Math.min(Math.max(0, pageNumber), pageCount - 1);
    }

    const moved = pageNumber !== this.state.currentPage;
    const scrollStep = (moved ? step : 0) + this.childIndex;
    const nextChildIdx = (pageNumber > 0 || this.props.isLoop) ? 1 : 0;

    const postChange = () => {
      this.fling = false;
      this.childIndex = nextChildIdx;
      this.state.scrollValue.setValue(nextChildIdx);
      this.setState({
        currentPage: pageNumber,
      });
    };

    if (animate) {
      this.fling = true;
      this.props.animation(this.state.scrollValue, scrollStep, gs)
        .start((event) => {
          if (event.finished) {
            postChange();
          }
          moved && this.props.onChangePage && this.props.onChangePage(pageNumber);
        });
    } else {
      postChange();
      moved && this.props.onChangePage && this.props.onChangePage(pageNumber);
    }
  }

  getCurrentPage() {
    return this.state.currentPage;
  }

  _getPage(pageIdx, loop, type) {
    const dataSource = this.props.dataSource;
    const pageID = dataSource.pageIdentities[pageIdx];
    return (
      <StaticRenderer
        key={`p_${pageID}${loop && dataSource.pageIdentities.length <= 2 ? '_1' : ''}`}
        shouldUpdate={true}
        render={this.props.renderPage.bind(
          null,
          dataSource.getPageData(pageIdx),
          pageIdx,
          this.state.scrollValue,
            type,
        )}
      />
    );
  }

  render() {
    const dataSource = this.props.dataSource;
    const pageIDs = dataSource.pageIdentities;

    const bodyComponents = [];

    let pagesNum = 0;
    let hasLeft = false;
    const viewWidth = this.state.viewWidth;

    if (pageIDs.length > 0 && viewWidth > 0) {
      // left page
      if (this.state.currentPage > 0) {
        bodyComponents.push(this._getPage(this.state.currentPage - 1, false, 'left'));
        pagesNum++;
        hasLeft = true;
      } else if (this.state.currentPage == 0 && this.props.isLoop) {
        bodyComponents.push(this._getPage(pageIDs.length - 1, true, 'left'));
        pagesNum++;
        hasLeft = true;
      }

      // center page
      bodyComponents.push(this._getPage(this.state.currentPage, false, 'center'));
      pagesNum++;

      // right page
      if (this.state.currentPage < pageIDs.length - 1) {
        bodyComponents.push(this._getPage(this.state.currentPage + 1, false, 'right'));
        pagesNum++;
      } else if (this.state.currentPage == pageIDs.length - 1 && this.props.isLoop) {
        bodyComponents.push(this._getPage(0, true, 'right'));
        pagesNum++;
      }
    }

    const sceneContainerStyle = {
      width: viewWidth * pagesNum,
      flex: 1,
      flexDirection: 'row',
    };

    const offset = this.props.offset;
    // this.childIndex = hasLeft ? 1 : 0;
    // this.state.scrollValue.setValue(this.childIndex);
    const translateX = this.state.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [offset, -viewWidth + offset],
    });
    return (
      <View
        style={{ flex: 1 }}
        onLayout={(event) => {
              const viewWidth = this.props.childWidth;
              if (!viewWidth || this.state.viewWidth === viewWidth) {
                return;
              }
              this.setState({
                currentPage: this.state.currentPage,
                viewWidth,
              });
            }}
      >
        <Animated.View
          style={[sceneContainerStyle, { transform: [{ translateX }] }]}
          {...this._panResponder.panHandlers}
        >
          {bodyComponents}
        </Animated.View>
      </View>
    );
  }
};

module.exports = ViewPager;
