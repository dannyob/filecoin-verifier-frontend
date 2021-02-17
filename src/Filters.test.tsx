import BigNumber from 'bignumber.js';
import React from 'react';
import {
    addressFilter,
    datacapFilter,
    iBtoB,
    BtoiB
} from './utils/Filters'

test('Should return a short address', () => {
    const address = addressFilter('t1kjtosjspglqxjglgbnqzgwh2v2n4mct2ju7nesq')
    expect(address).toBe("t1kjt...7nesq")
});

test('Should return a short address', () => {
    const address = addressFilter('')
    expect(address).toBe("...")
});

test('Should return 0 B on filter empty input', () => {
    const datacap = datacapFilter('')
    expect(datacap).toBe("0 B")
});

test('Should return 1KB on filter empty input', () => {
    const datacap = datacapFilter('1232')
    expect(datacap).toBe("1 KiB")
});

test('Should return 1KB on filter empty input', () => {
    const datacap = datacapFilter('1232')
    expect(datacap).toBe("1 KiB")
});

test('Should return 1 B on filter empty input', () => {
    const datacap = datacapFilter('1.232')
    expect(datacap).toBe("1 B")
});

test('Should return 1 YiB. Smaller than biggest datacap ext', () => {
    const datacap = datacapFilter('1208925819614629174706151275')
    expect(datacap).toBe("1 YiB")
});

test('Should return 999+ YiB. Bigger than biggest datacap ext', () => {
    const datacap = datacapFilter('12089258196146291747061512752222')
    expect(datacap).toBe("999+ YiB")
});

test('Should return a multiplied Bignum ber', () => {
    const multiplied = iBtoB(new BigNumber(3))
    expect(multiplied).toBeInstanceOf(BigNumber)
});


test('Should return a multiplied Bignum ber', () => {
    const multiplied = BtoiB(new BigNumber(3))
    expect(multiplied).toBeInstanceOf(BigNumber)
});




