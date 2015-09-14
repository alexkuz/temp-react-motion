import React from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import { TransitionSpring } from 'react-motion';

import pkg from '../../../package.json';

const styles = {
  wrapper: {
    height: '100vh',
    width: '80%',
    margin: '0 auto',
    padding: '1px 0'
  },
  header: {
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: '100px'
  }
};

const PAGES = [
  {
    title: 'first'
  },
  {
    title: 'second'
  },
  {
    title: 'third'
  }
];


export default class DemoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      direction: 'down'
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  getEndValue = () => {
    const idx = this.state.selected;
    return {
      [`page-${idx}`]: {
        ...PAGES[idx],
        opacity: { val: 1 },
        shift: { val: 0 }
      }
    };
  }

  willEnter = (key, value) => {
    return {
      ...value,
      opacity: { val: 1 },
      shift: { val: this.state.direction === 'up' ? -200 : 200 }
    }
  }

  willLeave = (key, value) => {
    return {
      ...value,
      opacity: { val: -0.8 },
      shift: { val: this.state.direction === 'up' ? 200 : -200 }
    }
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <PageHeader style={styles.header}>{pkg.name || '[[Package Name]]'}</PageHeader>
        <h5>Press ↑ or ↓ to switch page</h5>
        <div style={styles.content}>
          <TransitionSpring
            endValue={this.getEndValue()}
            willEnter={this.willEnter}
            willLeave={this.willLeave}>
              {currentValue =>
                <div style={{ position: 'relative' }}>
                  {[for (key of Object.keys(currentValue))
                    <div key={key}
                         style={{
                           position: 'absolute',
                           top: 0,
                           opacity: Math.max(0, currentValue[key].opacity.val),
                           transform: `translate3d(0, ${currentValue[key].shift.val}px, 0)`
                         }}>
                      <h1>
                        {currentValue[key].title}
                      </h1>
                      <div>{currentValue[key].text}</div>
                    </div>
                  ]}
                </div>
              }
          </TransitionSpring>
        </div>
      </div>
    );
  }

  handleKeyDown = e => {
    if (e.keyCode === 40 && this.state.selected < 2) { // Down
      this.setState({ selected: this.state.selected + 1, direction: 'down' })
    } else if (e.keyCode === 38 && this.state.selected > 0) { // Up
      this.setState({ selected: this.state.selected - 1, direction: 'up' })
    }
  }
}
