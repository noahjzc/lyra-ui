import { describe, expect, it } from 'vitest';
import * as PopoverStories from '../../src/components/data-view/popover/stories/Popover.stories';
import * as PopconfirmStories from '../../src/components/feedback/popconfirm/stories/Popconfirm.stories';

describe('Popover stories', () => {
  it('exposes placement and arrow variants in Storybook', () => {
    expect(PopoverStories.PlacementMatrix).toBeDefined();
    expect(PopoverStories.ArrowOptions).toBeDefined();
    expect(PopconfirmStories.PlacementAndArrow).toBeDefined();
  });
});
