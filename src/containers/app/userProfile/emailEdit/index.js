//@flow
import React, { PureComponent } from 'react'
import Headline from '../components/headline'
import InputMinimal from 'components/inputMinimal'
import './styles.css'

type Props = {

}

type State = {
  email: string,
  password: string,
}

export default class EmailEdit extends PureComponent {
  props: Props
  state: State

  constructor(props: Props){
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  render(){
    return(
      <fb className="profileEmailEditMain">
        <Headline title='Email' />
        <fb className='content'>
          <fb className='label'>Neue Email Adresse</fb>
          <InputMinimal width={200} />
          <fb className='label'>Bestehendes Passwort</fb>
          <InputMinimal width={200} />
        </fb>
      </fb>
    )
  }
}
