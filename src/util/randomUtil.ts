function getRandom(from : number, to : number, isInt = true) {
    let val = Math.random() * (to - from + 1) + from;
    return isInt ? Math.floor(val) : val;
}

export {getRandom}
