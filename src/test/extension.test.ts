import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';

import {oofemParamTypes} from '../oofemParamTypes';

// import * as myExtension from '../../extension';

/*suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});*/

suite('oofem param types test suite', () => {
  test('rn - real number', () => {
    assert.strictEqual(oofemParamTypes.rn.validator('bleble'), false);
    assert.strictEqual(oofemParamTypes.rn.validator('NaN'), false);
    assert.strictEqual(oofemParamTypes.rn.validator('1'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('-1'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('1.0'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('-1.0'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('50e7'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('200e-5'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('-50e7'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('-200e-5'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('-4.'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('4.'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('50.e7'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('200.e-5'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('-50.e7'), true);
    assert.strictEqual(oofemParamTypes.rn.validator('-200.e-5'), true);
  });

  test('in - integer', () => {
    assert.strictEqual(oofemParamTypes.in.validator('bleble'), false);
    assert.strictEqual(oofemParamTypes.in.validator('NaN'), false);
    assert.strictEqual(oofemParamTypes.in.validator('1'), true);
    assert.strictEqual(oofemParamTypes.in.validator('-1'), true);
    assert.strictEqual(oofemParamTypes.in.validator('1.0'), true);
    assert.strictEqual(oofemParamTypes.in.validator('-1.0'), true);
    assert.strictEqual(oofemParamTypes.in.validator('50e7'), true);
    assert.strictEqual(oofemParamTypes.in.validator('200e-5'), false);
    assert.strictEqual(oofemParamTypes.in.validator('-50e7'), true);
    assert.strictEqual(oofemParamTypes.in.validator('-200e-5'), false);
    assert.strictEqual(oofemParamTypes.in.validator('-4.'), true);
    assert.strictEqual(oofemParamTypes.in.validator('4.'), true);
    assert.strictEqual(oofemParamTypes.in.validator('50.e7'), true);
    assert.strictEqual(oofemParamTypes.in.validator('200.e-5'), false);
    assert.strictEqual(oofemParamTypes.in.validator('-50.e7'), true);
    assert.strictEqual(oofemParamTypes.in.validator('-200.e-5'), false);

    assert.strictEqual(oofemParamTypes.in.validator('1.2312'), false);
    assert.strictEqual(oofemParamTypes.in.validator('-1.24124'), false);
    assert.strictEqual(oofemParamTypes.in.validator('50.2414e3'), false);
    assert.strictEqual(oofemParamTypes.in.validator('200.4214e-5'), false);
    assert.strictEqual(oofemParamTypes.in.validator('-50.12412e2'), false);
    assert.strictEqual(oofemParamTypes.in.validator('-200.214124e-5'), false);
  });

  test('ra - real array', () => {
    assert.strictEqual(oofemParamTypes.ra.validator(''), false);
    assert.strictEqual(oofemParamTypes.ra.validator('3'), false);
    assert.strictEqual(oofemParamTypes.ra.validator('3.5'), false);
    assert.strictEqual(oofemParamTypes.ra.validator('3 1 2.123'), false);
    assert.strictEqual(oofemParamTypes.ra.validator('1 5.324'), true);
    assert.strictEqual(oofemParamTypes.ra.validator('2 3.123 9.322'), true);
    assert.strictEqual(oofemParamTypes.ra.validator('3 1.2 2.9 -0.1'), true);
  });

  test('ia - int array', () => {
    assert.strictEqual(oofemParamTypes.ia.validator(''), false);
    assert.strictEqual(oofemParamTypes.ia.validator('3'), false);
    assert.strictEqual(oofemParamTypes.ia.validator('3.5'), false);
    assert.strictEqual(oofemParamTypes.ia.validator('3 1 2.123'), false);
    assert.strictEqual(oofemParamTypes.ia.validator('1 5.324'), false);
    assert.strictEqual(oofemParamTypes.ia.validator('2 3.123 9.322'), false);
    assert.strictEqual(oofemParamTypes.ia.validator('3 1.2 2.9 -0.1'), false);
    assert.strictEqual(oofemParamTypes.ia.validator('1 5'), true);
    assert.strictEqual(oofemParamTypes.ia.validator('2 3 9'), true);
    assert.strictEqual(oofemParamTypes.ia.validator('3 1 2 -1'), true);
  });

  test('ch - character', () => {
    assert.strictEqual(oofemParamTypes.ch.validator(''), false);
    assert.strictEqual(oofemParamTypes.ch.validator('a'), true);
    assert.strictEqual(oofemParamTypes.ch.validator('ab'), false);
    assert.strictEqual(oofemParamTypes.ch.validator('abc'), false);
    assert.strictEqual(oofemParamTypes.ch.validator('27'), true);
    assert.strictEqual(oofemParamTypes.ch.validator('27.111'), false);
  })
});