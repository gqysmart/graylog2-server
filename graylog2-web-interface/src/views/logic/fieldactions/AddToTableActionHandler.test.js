import AggregationWidget from '../aggregationbuilder/AggregationWidget';
import AddToTableActionHandler from './AddToTableActionHandler';
import MessagesWidget from '../widgets/MessagesWidget';
import MessagesWidgetConfig from '../widgets/MessagesWidgetConfig';

describe('AddToTableActionHandler.condition', () => {
  it('enables action if field is presented in message table', () => {
    const widget = MessagesWidget.builder()
      .config(MessagesWidgetConfig.builder().fields(['foo']).build())
      .build();
    const context = { widget };

    const result = AddToTableActionHandler.condition({ context, name: 'foo' });
    expect(result).toEqual(false);
  });
  it('enables action if field is presented in message table', () => {
    const widget = MessagesWidget.builder()
      .config(MessagesWidgetConfig.builder().build())
      .build();
    const context = { widget };

    const result = AddToTableActionHandler.condition({ context, name: 'foo' });
    expect(result).toEqual(true);
  });
  it('checks properly for non message tables', () => {
    const widget = AggregationWidget.builder().build();
    const context = { widget };

    const result = AddToTableActionHandler.condition({ context, name: 'foo' });
    expect(result).toEqual(false);
  });
});
