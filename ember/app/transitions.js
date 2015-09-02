export default function () {
    this.transition(
        this.hasClass('lequestion'),
        this.toValue(false),
        this.use('toDown', { duration: 1500 })
    );
}

