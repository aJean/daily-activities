import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import AppFixed from './FixedMode';
import AppDrag from './DragMode';

const apps = {
  fixed: AppFixed,
  drag: AppDrag,
};
const initialAppType = window.localStorage.getItem('@@__APP_TYPE__@@');

const App = () => {
  const [appType, setAppType] = useState(initialAppType);
  const AppComponent = apps[appType] || apps['fixed'];

  const handleApp = (type: string) => {
    setAppType(type);
    window.localStorage.setItem('@@__APP_TYPE__@@', type);
  };
  
  return (
    <>
      <div>
        应用类型：
        {Object.keys(apps).map(key => <Button type={key === appType ? 'primary' : 'default'} key={key} style={{margin: 4}} onClick={() => handleApp(key)}>{key}</Button>)}
      </div>
      <AppComponent />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
