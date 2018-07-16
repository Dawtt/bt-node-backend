import React, { Component, Fragment} from 'react';
import { Header, Footer} from './Layouts/index.js';
import Exercises from './Exercises/index';
import Dave from './Layouts/Dave.js';


export default class extends Component {
	render() {
		return <Fragment>
				<Header />

				<Exercises />
			
				<Footer/>

				<Dave />
		</Fragment>
	}
}