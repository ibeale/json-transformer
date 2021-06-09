import {getValueGivenString, setValueGivenString} from './json-converter'

let fname = "Isaac"
let cseClasses: number[] = [543]
let testObj = {
    fname : fname,
    lname : "Beale",
    classes : {
        CSE: cseClasses,
        SER: {
            Tempe: [
                501,
                502
            ],
            Poly: [
                515,
                516
            ]
        }
    }
}

test('Get top level property', () => {
        expect(getValueGivenString(testObj, "fname")).toBe(fname);
    });

test('Get second level property', () => {
        expect(getValueGivenString(testObj, "classes.CSE")).toBe(cseClasses);
    });

test('Set top level property', () => {
    let fname = "Allen"
    setValueGivenString(testObj, "fname", fname)
    expect(testObj.fname).toBe(fname)
})

test('Set second level property', () => {
    let cseClasses = [511, 512]
    setValueGivenString(testObj, "classes.CSE", cseClasses)
    expect(testObj.classes.CSE).toBe(cseClasses)
})