import React from 'react';
import MapScreen from 'src/components/MapScreen'
import { store } from 'src/store'
import { Provider } from 'react-redux'

const App : React.FC = () => {
    return (
        <Provider store={store}>
            <MapScreen/>
        </Provider>
    )
}

export default App;
