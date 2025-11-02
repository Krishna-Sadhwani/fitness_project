import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({ class: className = '', url = '#', text = '', ...rest }) => {
  const isExternal = /^https?:\/\//i.test(url)
  if (isExternal) {
    return (
      <a href={url} className={`btn ${className}`} {...rest}>
        {text}
      </a>
    )
  }
  return (
    <Link to={url} className={`btn ${className}`} {...rest}>
      {text}
    </Link>
  )
}

export default Button