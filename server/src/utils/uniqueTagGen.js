const uniqueTagGen = ()=>{
    return new Promise((resolve) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let userTag = '';
        for (let i = 0; i < 6; i++) {
            userTag += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        resolve(userTag);
    });
}

export { uniqueTagGen };