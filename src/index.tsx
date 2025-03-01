import React from 'react';
import {createRoot} from 'react-dom/client';
import {Component} from '@tylerlong/use-proxy/build/react';
import {Col, Divider, Row, Select} from 'antd';

import './index.css';
import store, {Store} from './store';
import {counties, states, countries} from './utils';

class App extends Component<{store: Store}> {
  render() {
    const {store} = this.props;
    return (
      <Row>
        <Col offset={1} span={22}>
          <h1>COVID Tracker &amp; Charts</h1>
          <div className="app-only"></div>
          <div className="form">
            <Select
              style={{width: 192}}
              value={store.range}
              onChange={range => store.selectRange(range)}
            >
              <Select.Option value={7}>Last 7 days</Select.Option>
              <Select.Option value={30}>Last 30 days</Select.Option>
              <Select.Option value={90}>Last 90 days</Select.Option>
              <Select.Option value={180}>Last 180 days</Select.Option>
              <Select.Option value={365}>Last 365 days</Select.Option>
              <Select.Option value={-1}>Since 2022-01-01</Select.Option>
            </Select>
            <Select
              style={{width: 192}}
              value={store.country}
              onChange={country => store.selectCountry(country)}
              showSearch
            >
              <Select.Option value="Worldwide">Worldwide</Select.Option>
              {countries.map(country => (
                <Select.Option value={country} key={country}>
                  {country}
                </Select.Option>
              ))}
            </Select>
            {(states[store.country] ?? []).length > 0 ? (
              <Select
                style={{width: 192}}
                value={store.state}
                onChange={state => store.selectState(state)}
                showSearch
              >
                <Select.Option value="Countrywide">Countrywide</Select.Option>
                {states[store.country].map(state => (
                  <Select.Option value={state} key={state}>
                    {state}
                  </Select.Option>
                ))}
              </Select>
            ) : null}
            {(counties[store.state] ?? []).length > 0 ? (
              <Select
                style={{width: 192}}
                value={store.county}
                onChange={county => store.selectCounty(county)}
                showSearch
              >
                <Select.Option value="Statewide">Statewide</Select.Option>
                {counties[store.state].map(county => (
                  <Select.Option value={county} key={county}>
                    {county}
                  </Select.Option>
                ))}
              </Select>
            ) : null}
          </div>
          <Divider />
          <Row gutter={[64, 64]}>
            <Col xs={24} xxl={12}>
              <canvas id="confirmed-chart"></canvas>
            </Col>
            <Col xs={24} xxl={12}>
              <canvas id="confirmed-chart-2"></canvas>
            </Col>
            <Col xs={24} xxl={12}>
              <canvas id="deaths-chart"></canvas>
            </Col>
            <Col xs={24} xxl={12}>
              <canvas id="deaths-chart-2"></canvas>
            </Col>
          </Row>
          <Divider />
          <p>
            Data provided by{' '}
            <a target="_blank" href="https://github.com/CSSEGISandData">
              CSSE at Johns Hopkins University
            </a>
            <span className="website-only">
              {' '}
              |{' '}
              <a
                href="https://github.com/tylerlong/covid-app/releases"
                target="_blank"
              >
                Download App
              </a>
            </span>
          </p>
        </Col>
      </Row>
    );
  }
  async componentDidMount() {
    store.initChart();
    await store.loadQueries();
    await store.saveQueries();
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App store={store} />);
