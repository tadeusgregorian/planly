//@flow
import React, { PureComponent } from 'react'

import { getPosOfElement, isInsideColorPicker } from './localHelpers'
import colors from 'constants/colors'
import './styles.css'

type Props = {
  targetID: string, // the id of the html element you want to use as popover target
  onPick: (string)=>void
}

type State = {
  isOpen: boolean
}

export default class ColorPicker extends PureComponent{
  props: Props;
  state: State;

  state = { isOpen: false }
  targetElement: ?HTMLElement = null

  componentDidMount = () => {
    this.targetElement = (document.getElementById(this.props.targetID): any)
    if(!this.targetElement){ throw new Error('TADE - target Element doesnt exist') }

    this.targetElement && this.targetElement.addEventListener('click', this.targetClicked)
    document.addEventListener('click', this.clickListener)
  }

  componentWillUnmount = () => {
    document.removeEventListener('click', this.clickListener)
    this.targetElement && this.targetElement.removeEventListener('click', this.targetClicked)
  }

  // target is the initial elemnt that opens the popover when clicked
  targetClicked = (e: MouseEvent) => {
    e.stopPropagation(); // neccessary so clickListener is not getting fired for this click.
    this.setState({isOpen: !this.state.isOpen})
  }

  clickListener = (e: MouseEvent) => {
    const { isOpen } = this.state
    const target: HTMLElement = (e.target : any)

    if(isOpen){
      const clickedOutside = !isInsideColorPicker(target)
      if(clickedOutside) this.setState({isOpen: false})

      const clickedColor = target.hasAttribute('data-color-option') && target.getAttribute('data-color')
      clickedColor && this.pickColor(clickedColor)
    }
  }

  pickColor = (color: string) => {
    this.props.onPick(color)
    this.setState({isOpen: false})
  }

  render(){
    const display = this.state.isOpen ? 'flex' : 'none'
    const targetPos = this.targetElement ? getPosOfElement(this.targetElement) : { top: 0, left: 0, width: 0, height: 0 }
    const width = 114
    const height = 114
    const left = targetPos.left - (( width - targetPos.width) / 2)
    const top = targetPos.top - height - 10
    const style = { display, width, height, top, left }

    return(
      <fb className="colorPicerPopoverMain arrow_box_cpi" style={style} data-type='color-picker'>
        { colors.map(c =>
          <fb key={c} className='colorOption' style={{backgroundColor: c}} data-color-option='true' data-color={c} />
        )}
      </fb>
    )
  }
}
