import React from 'react'
import { Cascader } from 'antd'
import PropTypes from 'prop-types'
import { request, config, arrayToTree } from '../../utils'

/**
 * 参见Cascader属性
 */
// 四级级联选择
class CountryCascader extends React.Component {
  constructor (props) {
    super(props)
    const value = props.value || ''
    this.state = {
      loading: false,
      data: [],
      value,
    }
  }

  componentWillMount () {
    this.fetch()
  }

  componentWillReceiveProps (nextProps) {
    nextProps.value && this.setState({ value: nextProps.value })
  }

  setValue = (value) => {
    if (value) {
      if (value.endsWith('000000')) {
        return [value]
      } else if (value.endsWith('0000')) {
        return [value.substring(0, 2).padEnd(8, '0'), value]
      } else if (value.endsWith('00')) {
        return [value.substring(0, 2).padEnd(8, '0'), value.substring(0, 4).padEnd(8, '0'), value]
      }
      return [value.substring(0, 2).padEnd(8, '0'), value.substring(0, 4).padEnd(8, '0'), value.substring(0, 6).padEnd(8, '0'), value]
    }
    return []
  }

  cascaderChange = (changeValue) => {
    const value = changeValue[changeValue.length - 1]
    this.setState({ value })
    const onChange = this.props.onChange
    if (onChange) {
      onChange(value)
    }
  }

  fetch = () => {
    this.setState({ loading: true })
    if (!sessionStorage.getItem('country') || JSON.parse(sessionStorage.getItem('country')).length === 0) {
      this.promise = request(
        {
          url: config.api.countys,
          method: 'get',
          data: { type: '0' },
        }
      ).then((data) => {
        if (data.success) {
          const country = arrayToTree(data.data, 'value', 'parent')
          sessionStorage.setItem('country', JSON.stringify(country))
          this.setState({ loading: false, data: country })
        } else {
          throw (data)
        }
      })
    } else {
      const { virtualCode } = this.props
      let data = JSON.parse(sessionStorage.getItem('country'))
      if (virtualCode) {
        const code = virtualCode.substring(0, 6)
        data = data.map((value) => {
          value.disabled = (value.value.substring(0, 6) !== code)
          return value
        })
      }
      this.setState({ loading: false, data })
    }
  }

  render () {
    return (
      <Cascader
        {...this.props}
        value={this.setValue(this.state.value)}
        options={this.state.data}
        placeholder="请选择地区"
        showSearch="true"
        notFoundContent="未找到匹配项"
        allowClear="true"
        onChange={this.cascaderChange}
        getPopupContainer={triggerNode => triggerNode.parentNode}
      />
    )
  }
}


CountryCascader.propTypes = {
  vaule: PropTypes.string,
  onChange: PropTypes.func,
}

export default CountryCascader
