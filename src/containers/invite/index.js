import React, { PureComponent } from 'react';
import './styles.css'


export default class Login extends PureComponent {
	constructor() {
		super()

		this.state = {
      pw1: '',
      pw2: '',
      error: '',
      state: ''
    }
	}

  componentDidMount = () => {
    fetch('./api/projects')
      .then(res => console.log(res))
      .catch(err => console.log('error tade: ', err))
  }


	render() {
		const { pw1, pw2 } = this.state

		return (
			<fb className='login-outer-container'>
        <input type='text' value={pw1}  onChange={(e)=>this.setState({ pw1: e.target.value })}  />
        <input type='text' value={pw2}  onChange={(e)=>this.setState({ pw2: e.target.value })}  />
        <fb className='sbtn'>speichern</fb>
			</fb>
		)
	}
}
