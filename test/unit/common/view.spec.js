import View from '../../../src/view';

import { renderView, destroyView } from '../../../src/common/view';

describe('common view methods', function() {
  let view;

  beforeEach(function() {
    view = new View({
      template: _.template('content')
    });
    view.triggerMethod = this.sinon.stub();
  });

  describe('#renderView', function() {
    beforeEach(function() {
      view.render = this.sinon.stub();
    });

    describe('when render lifecycle is supported', function() {
      beforeEach(function() {
        view.supportsRenderLifecycle = true;
        renderView(view);
      });

      it('should call render', function() {
        expect(view.render).to.be.calledOnce;
      });

      it('should not trigger events', function() {
        expect(view.triggerMethod).to.not.be.called;
      });

      describe('when view is rendered twice', function() {
        it('should call not call render again', function() {
          renderView(view);

          expect(view.render)
            .to.have.been.calledOnce
            .to.not.have.been.calledTwice;
        });
      });
    });
  });
});
