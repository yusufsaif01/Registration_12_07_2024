class League {
    static get ALLOWED_VALUES() {
        return [
            'Hero Indian Super League',
            'Hero Indian women’s League',
            'Hero I-League',
            'Hero 2nd Division',
            'Hero Elite League',
            'Hero Junior League',
            'Hero Sub - Junior League',
            'Hero Super Cup',
            'Hero Gold Cup',
            'Second Division League',
            'Golden Baby Leagues',
            'Hero Senior NFC',
            'Hero Senior Women NFC',
            'Hero Junior NFC',
            'Hero Junior Girl NFC',
            'Hero Sub-Junior NFC',
            'Hero Sub-Junior Girl’s NFC',
            'Other'
        ]
    }
    static get OTHER() {
        return "Other"
    }
}
module.exports = League