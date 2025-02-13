import {expect} from 'chai';
import fs from 'fs-extra';
import {after, before, describe, it} from 'mocha';

import {LOG} from '../../src/messages.js';
import {CLASP_PATHS, CLASP_SETTINGS} from '../constants.js';
import {cleanup, runClasp, setup} from '../functions.js';

describe('Test clasp run function', () => {
  before(setup);
  it('should properly run in dev mode', () => {
    const result = runClasp(['run']);
    expect(result.stdout).to.include('Running in dev mode.');
  });
  it('should not run in dev mode', () => {
    const result = runClasp(['run', '--nondev']);
    expect(result.stdout).to.not.include('Running in dev mode.');
  });
  it('should prompt for which function to run', () => {
    const result = runClasp(['run']);
    expect(result.stdout).to.not.include('Select a functionName.');
  });
  it('should not prompt for which function to run', () => {
    const result = runClasp(['run', "'sendEmail'"]);
    expect(result.stdout).to.not.include('Select a functionName.');
  });

  // These tests will remain skipped until they can be fixed.
  // TODO: this test needs to be updated
  it.skip('should prompt for project ID', () => {
    const result = runClasp(['run', 'myFunction']);
    expect(result.stdout).to.contain(LOG.ASK_PROJECT_ID);
  });
  // TODO: this test needs to be updated
  it.skip('should prompt to set up new OAuth client', () => {
    fs.writeFileSync(CLASP_PATHS.settingsLocal, CLASP_SETTINGS.invalid);
    const result = runClasp(['run', 'myFunction']);
    fs.removeSync(CLASP_PATHS.settingsLocal);
    expect(result.stdout).to.contain('https://console.developers.google.com/apis/credentials?project=');
    expect(result.stderr).to.equal('');
    expect(result.status).to.equal(0);
  });
  after(cleanup);
});
