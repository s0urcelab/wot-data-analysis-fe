export default path => {
    const prefix = REACT_APP_ENV === 'dev' ? '/api' : API_PREFIX
    return `${prefix}${path}`
}
