import _ from 'underscore';
import Behavior from '../../src/behavior';
import View from '../../src/view';
import CollectionView from '../../src/collection-view';
import { bindEvents } from '../../src/backbone.marionette';

describe('Behavior', function() {
  describe('when instantiating a behavior with some options', function() {
    it('should merge the options into instance options', function() {
      const createOptions = {foo: 'bar'};
      const behavior = new Behavior(createOptions);

      expect(behavior.options).to.eql(createOptions);
    });
  });

  describe('behavior parsing', function() {
    let behaviorSpies;
    let FooView;

    beforeEach(function() {
      const Bar = Behavior.extend({});
      const Baz = Behavior.extend({});

      behaviorSpies = {
        foo: this.sinon.spy(Behavior),
        bar: this.sinon.spy(Bar),
        baz: this.sinon.spy(Baz)
      };
    });

    describe('with array notation', function() {
      describe('when one behavior', function() {
        beforeEach(function() {
          FooView = View.extend({
            behaviors: [behaviorSpies.foo]
          });
        });

        it('should instantiate the behavior', function() {
          /* eslint-disable no-unused-vars */
          const fooView = new FooView();

          expect(behaviorSpies.foo).to.have.been.calledOnce;
        });
      });

      describe('when multiple behaviors', function() {
        beforeEach(function() {
          FooView = View.extend({
            behaviors: [behaviorSpies.foo, behaviorSpies.bar]
          });
        });

        it('should instantiate the behaviors', function() {
          /* eslint-disable no-unused-vars */
          const fooView = new FooView();

          expect(behaviorSpies.foo).to.have.been.calledOnce;
          expect(behaviorSpies.bar).to.have.been.calledOnce;
        });
      });

      describe('when behavior class is provided', function() {
        beforeEach(function() {
          FooView = View.extend({
            behaviors: [{behaviorClass: behaviorSpies.foo}]
          });
        });

        it('should instantiate the behavior', function() {
          /* eslint-disable no-unused-vars */
          const fooView = new FooView();

          expect(behaviorSpies.foo).to.have.been.calledOnce;
        });
      });

      describe('when behavior class and constructor are provided', function() {
        beforeEach(function() {
          FooView = View.extend({
            behaviors: [behaviorSpies.foo, behaviorSpies.bar, {
              behaviorClass: behaviorSpies.baz
            }]
          });
        });

        it('should instantiate the behaviors', function() {
          /* eslint-disable no-unused-vars */
          const fooView = new FooView();

          expect(behaviorSpies.foo).to.have.been.calledOnce;
          expect(behaviorSpies.bar).to.have.been.calledOnce;
          expect(behaviorSpies.baz).to.have.been.calledOnce;
        });
      });
    });

    describe('with object notation', function() {
      describe('when one behavior', function() {
        beforeEach(function() {
          FooView = View.extend({
            behaviors: {x: behaviorSpies.foo}
          });
        });

        it('should instantiate the behavior', function() {
          /* eslint-disable no-unused-vars */
          const fooView = new FooView();

          expect(behaviorSpies.foo).to.have.been.calledOnce;
        });
      });

      describe('when multiple behaviors', function() {
        beforeEach(function() {
          FooView = View.extend({
            behaviors: {x: behaviorSpies.foo, y: behaviorSpies.bar}
          });
        });

        it('should instantiate the behaviors', function() {
          /* eslint-disable no-unused-vars */
          const fooView = new FooView();

          expect(behaviorSpies.foo).to.have.been.calledOnce;
          expect(behaviorSpies.bar).to.have.been.calledOnce;
        });
      });

      describe('when behavior class is provided', function() {
        beforeEach(function() {
          FooView = View.extend({
            behaviors: {x: {behaviorClass: behaviorSpies.foo}}
          });
        });

        it('should instantiate the behavior', function() {
          /* eslint-disable no-unused-vars */
          const fooView = new FooView();

          expect(behaviorSpies.foo).to.have.been.calledOnce;
        });
      });

      describe('when behavior class and constructor are provided', function() {
        beforeEach(function() {
          FooView = View.extend({
            behaviors: {
              x: behaviorSpies.foo,
              y: behaviorSpies.bar,
              z: {
                behaviorClass: behaviorSpies.baz
              }
            }
          });
        });

        it('should instantiate the behaviors', function() {
          /* eslint-disable no-unused-vars */
          const fooView = new FooView();

          expect(behaviorSpies.foo).to.have.been.calledOnce;
          expect(behaviorSpies.bar).to.have.been.calledOnce;
          expect(behaviorSpies.baz).to.have.been.calledOnce;
        });
      });
    });


  });

  describe('behavior initialize', function() {
    let behavior;
    let view;

    beforeEach(function() {
      const TestBehavior = Behavior.extend({
        initialize: this.sinon.stub()
      });

      view = new View();

      behavior = new TestBehavior({ foo: 'bar' }, view);
    });

    it('should have a cidPrefix', function() {
      expect(behavior.cidPrefix).to.equal('mnb');
    });

    it('should have a cid', function() {
      expect(behavior.cid).to.exist;
    });

    it('should call initialize when a behavior is created', function() {
      expect(behavior.initialize)
        .to.have.been.calledOnce
        .and.calledWith({ foo: 'bar' }, view);
    });
  });

  describe('behavior initialize from constructor args', function() {
    let fooStub;
    let barStub;
    let FooView;
    let behaviorSpies;

    beforeEach(function() {
      fooStub = this.sinon.stub();
      barStub = this.sinon.stub();

      behaviorSpies = {
        foo: Behavior.extend({initialize: fooStub}),
        bar: Behavior.extend({initialize: barStub})
      };

      FooView = View.extend({
        behaviors: [behaviorSpies.foo]
      });
    });

    it('should call initialize when a behavior is created', function() {
      /* eslint-disable no-unused-vars */
      const fooView = new FooView({behaviors: [behaviorSpies.bar]});

      expect(barStub).to.have.been.calledOnce;
      expect(fooStub).not.to.have.been.called;
    });
  });

  describe('behavior events', function() {
    let fooClickStub;
    let barClickStub;
    let bazClickStub;
    let viewClickStub;
    let behaviorSpies;
    let FooView;
    let fooView;

    beforeEach(function() {
      fooClickStub = this.sinon.stub();
      barClickStub = this.sinon.stub();
      bazClickStub = this.sinon.stub();
      viewClickStub = this.sinon.stub();

      behaviorSpies = {
        foo: Behavior.extend({
          events: {
            'click': fooClickStub
          }
        }),
        bar: Behavior.extend({
          events: {
            'click': barClickStub
          }
        }),
        baz: Behavior.extend({
          events: {
            'click': 'handleClick'
          },
          handleClick: bazClickStub
        })
      };

      FooView = View.extend({
        events: {
          'click': viewClickStub
        },
        behaviors: {
          x: behaviorSpies.foo,
          y: behaviorSpies.bar,
          z: behaviorSpies.baz
        }
      });

      fooView = new FooView();
    });

    it('should call first behaviors event', function() {
      fooView.$el.click();

      expect(fooClickStub).to.have.been.calledOnce.and.calledOn(this.sinon.match.instanceOf(behaviorSpies.foo));
    });

    it('should call second behaviors event', function() {
      fooView.$el.click();

      expect(barClickStub).to.have.been.calledOnce.and.calledOn(this.sinon.match.instanceOf(behaviorSpies.bar));
    });

    it('should call third behaviors event', function() {
      fooView.$el.click();

      expect(bazClickStub).to.have.been.calledOnce.and.calledOn(this.sinon.match.instanceOf(behaviorSpies.baz));
    });

    it('should call the view click handler', function() {
      fooView.$el.click();

      expect(viewClickStub).to.have.been.calledOnce.and.calledOn(fooView);
    });
  });

  describe('behavior triggers', function() {
    let onClickFooStub;
    let triggerMethodViewSpy;
    let triggerMethodSpy;
    let behaviorSpies;
    let fooView;

    beforeEach(function() {
      onClickFooStub = this.sinon.stub();

      behaviorSpies = {
        foo: Behavior.extend({
          triggers: {'click': 'click:foo'},
          onClickFoo: onClickFooStub
        })
      };

      const FooView = View.extend({
        triggers: {
          'click': 'click:foo:view'
        },
        behaviors: [behaviorSpies.foo]
      });

      const fooModel = new Backbone.Model();
      const fooCollection = new Backbone.Collection();

      fooView = new FooView({
        model: fooModel,
        collection: fooCollection
      });

      triggerMethodSpy = this.sinon.spy();
      triggerMethodViewSpy = this.sinon.spy();

      fooView.on('click:foo', triggerMethodSpy);
      fooView.on('click:foo:view', triggerMethodViewSpy);
    });

    it('should call `triggerMethod` with the triggered event', function() {
      fooView.$el.click();

      expect(triggerMethodSpy)
        .to.have.been.calledOnce
        .and.calledOn(fooView);
    });

    it('should call the triggered method', function() {
      fooView.$el.click();

      expect(onClickFooStub)
        .to.have.been.calledOnce
        .and.have.been.calledOn(this.sinon.match.instanceOf(behaviorSpies.foo));
    });

    it('should not collide with view triggers with same event', function() {
      fooView.$el.click();

      expect(triggerMethodViewSpy)
        .to.have.been.calledOnce
        .and.calledOn(fooView);
    });
  });

  describe('proxyViewProperties', function() {
    let fooBehavior;
    let fooView;

    beforeEach(function() {
      const behaviorSpies = {
        foo: Behavior.extend({
          initialize: function() {
            fooBehavior = this;
          }
        })
      };

      const FooView = View.extend({
        behaviors: [behaviorSpies.foo]
      });

      fooView = new FooView();
    });

    it('should proxy the views $el', function() {
      fooView.setElement(document.createElement('bar'));

      expect(fooBehavior.$el).to.equal(fooView.$el);
    });

    it('should proxy the views el', function() {
      fooView.setElement(document.createElement('bar'));

      expect(fooBehavior.el).to.equal(fooView.el);
    });
  });

  describe('behavior instance events', function() {
    let listenToChangeStub;
    let onFooStub;
    let fooModel;
    let fooView;

    beforeEach(function() {
      fooModel = new Backbone.Model();

      listenToChangeStub = this.sinon.stub();
      onFooStub = this.sinon.stub();

      const FooBehavior = Behavior.extend({
        initialize: function() {
          this.listenTo(fooModel, 'change', listenToChangeStub);
          this.on('foo', onFooStub);
        }
      });

      const FooView = View.extend({
        behaviors: [FooBehavior]
      });

      fooView = new FooView();
      fooView.destroy();
    });

    it('should unbind listenTo on destroy', function() {
      fooModel.set('bar', 'baz');

      expect(listenToChangeStub).not.to.have.been.calledOnce;
    });
  });

  describe('behavior model events', function() {
    let handleModelChangeStub;
    let handleCollectionResetStub;
    let handleModelFooChangeStub;
    let fooBehavior;
    let FooView;
    let FooCollectionView;
    let fooModel;
    let fooCollection;

    beforeEach(function() {
      handleModelChangeStub = this.sinon.stub();
      handleCollectionResetStub = this.sinon.stub();
      handleModelFooChangeStub = this.sinon.stub();

      const behaviorSpies = {
        foo: Behavior.extend({
          initialize: function() {
            fooBehavior = this;
          },
          modelEvents: {
            'change': handleModelChangeStub,
            'change:foo': 'handleModelFooChange'
          },
          collectionEvents: {
            'reset': handleCollectionResetStub
          },
          handleModelFooChange: handleModelFooChangeStub
        })
      };

      FooCollectionView = CollectionView.extend({
        behaviors: [behaviorSpies.foo]
      });
      FooView = View.extend({
        behaviors: [behaviorSpies.foo]
      });

      fooModel = new Backbone.Model({foo: 'bar'});
      fooCollection = new Backbone.Collection([]);
    });

    it('should proxy model events', function() {
      /* eslint-disable no-unused-vars */
      const fooView = new FooView({model: fooModel});
      fooModel.set('foo', 'baz');

      expect(handleModelChangeStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
    });

    it('should proxy model events w/ string cbk', function() {
      /* eslint-disable no-unused-vars */
      const fooView = new FooView({model: fooModel});
      fooModel.set('foo', 'baz');

      expect(handleModelFooChangeStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
    });

    it('should proxy collection events', function() {
      /* eslint-disable no-unused-vars */
      const fooCollectionView = new FooCollectionView({collection: fooCollection});
      fooCollection.reset();

      expect(handleCollectionResetStub).to.have.been.calledOnce.and.calledOn(fooBehavior);
    });

    it('should unbind model events on view undelegateEntityEvents', function() {
      const fooView = new FooView({model: fooModel});
      fooView.undelegateEntityEvents();
      fooModel.set('foo', 'doge');

      expect(handleModelFooChangeStub).not.to.have.been.called;
    });

    it('should unbind collection events on view undelegateEntityEvents', function() {
      const fooCollectionView = new FooCollectionView({collection: fooCollection});
      fooCollectionView.undelegateEntityEvents();
      fooCollection.reset();

      expect(handleCollectionResetStub).not.to.have.been.called;
    });
  });

  describe('behavior trigger calls', function() {
    let onRenderStub;
    let fooView;

    beforeEach(function() {
      onRenderStub = this.sinon.stub();

      const behaviorSpies = {
        foo: Behavior.extend({
          onRender: onRenderStub
        })
      };

      const FooView = View.extend({
        behaviors: [behaviorSpies.foo]
      });

      fooView = new FooView();
    });

    it('should call onRender when a view is rendered', function() {
      fooView.triggerMethod('render');

      expect(onRenderStub).to.have.been.calledOnce;
    });
  });

  describe('behavior is evented', function() {
    let listenToStub;
    let changeStub;
    let behavior;
    let fooModel;

    beforeEach(function() {
      listenToStub = this.sinon.stub();
      changeStub = this.sinon.stub();

      behavior = new Behavior({}, {});
      fooModel = new Backbone.Model();

      bindEvents(behavior, fooModel, {
        'change': changeStub
      });

      behavior.listenTo(fooModel, 'foo', listenToStub);
    });

    it('should listenTo events', function() {
      fooModel.trigger('foo');

      expect(listenToStub).to.have.been.calledOnce;
    });

    it('should support bindEntityEvents', function() {
      fooModel.set('foo', 'bar');

      expect(changeStub).to.have.been.calledOnce;
    });

    it('should execute in the specified context', function() {
      fooModel.trigger('foo');

      expect(listenToStub).to.have.been.calledOnce.and.calledOn(behavior);
    });
  });

  describe('#destroy', function() {
    let behavior;
    let view;

    beforeEach(function() {
      view = new View();
      behavior = new Behavior({}, view);
      this.sinon.spy(behavior, '_deleteEntityEventHandlers');
      this.sinon.spy(behavior, 'destroy');
      this.sinon.spy(behavior, 'stopListening');
      this.sinon.spy(view, '_removeBehavior');

      behavior.destroy();
    });

    it('should delete entity event handlers', function() {
      expect(behavior._deleteEntityEventHandlers).to.have.been.calledOnce;
    });

    it('should stopListening', function() {
      expect(behavior.stopListening).to.have.been.calledOnce;
    });

    it('should remove the behavior from the view', function() {
      expect(view._removeBehavior).to.have.been.calledOnce;
    });

    it('should return the behavior', function() {
      expect(behavior.destroy).to.have.returned(behavior);
    });
  });

  describe('#_getEvents', function() {
    let behavior;
    let eventHandlers;

    beforeEach(function() {
      eventHandlers = {
        'click .test'() {},
        'click .no-handler': null,
        'click .test2': 'onHandler'
      };

      const MyBehavior = Behavior.extend({
        events() {
          return eventHandlers;
        },
        onHandler: this.sinon.stub()
      });

      behavior = new MyBehavior();
      this.sinon.spy(behavior, '_getEvents');
    });

    it('should convert named handlers to bound instance handlers', function() {
      const events = behavior._getEvents();
      const onHandler = _.last(_.values(events));
      onHandler();

      expect(behavior.onHandler).to.be.calledOn(behavior);
    });

    it('should remove events without handlers', function() {
      const events = behavior._getEvents();
      expect(_.values(events)).to.be.lengthOf(2);
    });

    it('should namespace the handlers', function() {
      const events = behavior._getEvents();
      _.each(_.keys(events), key => {
        expect(key).to.have.string('.' + behavior.cid);
      });
    });

    describe('when there are no events', function() {
      beforeEach(function() {
        behavior.events = null;
        behavior._getEvents();
      });

      it('should return undefined', function() {
        expect(behavior._getEvents).to.have.returned(undefined);
      });
    });
  });
});
