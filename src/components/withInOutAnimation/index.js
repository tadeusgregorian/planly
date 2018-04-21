import React, { PureComponent } from 'react'

export default (Comp) => {
  return class extends PureComponent {
    constructor(props: Props){
      super(props)

      this.state = {
        visible: false,
        existent: false
      }
    }

    vanishTimeout;
    existentTimeout;

    componentDidMount = () => this.update({}, this.props)
    componentDidUpdate = (prevProps) => this.update(prevProps, this.props)

    componentWillUnmount = () => {
      clearTimeout(this.vanishTimeout)
      clearTimeout(this.existentTimeout)
    }

    update = (prevProps, props) => {

      const appeared = !prevProps.present && props.present
      const disappeared = prevProps.present && !props.present

      if(appeared){

        console.log('Appear')

        this.setState({ existent: true })
        setTimeout(() => this.setState({ visible: true }), 1)

        this.vanishTimeout = this.props.timeTillVanish && setTimeout(
          () => this.props.onVanish && this.props.onVanish(),
          this.props.timeTillVanish
        )
      }

      if(disappeared){

        console.log('Disappear')

        clearTimeout(this.vanishTimeout)
        this.setState({ visible: false })
        this.existentTimeout = setTimeout(() => this.setState({ existent: false }), 500)
      }
    }



    render = () => {

      return(
        this.state.existent
          ? <Comp visible={this.state.visible} {...this.props} />
          : null
      )
    }
  }
}
