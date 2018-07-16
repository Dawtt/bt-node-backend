import { configure } from '@storybook/react';

function loadStories() {
  require('../src/stories');
  require('../client/src/Components/Layouts/Header.js');
}

configure(loadStories, module);
