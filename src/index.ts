const App = () => {
    const root = document.createElement('div')
    root.textContent = 'Hello world !'
    return root
}

document.body.appendChild(App())