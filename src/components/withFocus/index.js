import React, { PureComponent } from 'react'

export default (Comp) => {
  return class extends PureComponent {
    constructor(props: Props){
      super(props)

      this.state = {
        isManagingFocus: false
      }
    }

    _onBlur = () => {
        setTimeout(() => {
          if (this.state.isManagingFocus) {
            this.setState({
              isManagingFocus: false,
            });
          }
        }, 0);
      }

    _onFocus = () => {
      if (!this.state.isManagingFocus) {
        this.setState({ isManagingFocus: true });
      }
    }

    render = () => (
      <Comp
        onBlur={this._onBlur}
        onFocus={this._onFocus}
        focused={this.state.isManagingFocus}
        {...this.props}
      />
    )
  }
}
