import {HomeNavItem} from './home-nav-item';

describe('HomeItem', () => {
  it('should create an instance', () => {
    expect(new HomeNavItem()).toBeTruthy();
  });


  it('should accept values in the constructor', () => {
    // const homeItem = new HomeNavItem({
    //   displayName: 'hello',
    //   isDisplay: true
    // });
    // expect(homeItem.displayName).toEqual('hello');
    // expect(homeItem.isDisplay).toEqual(true);
  });
});
