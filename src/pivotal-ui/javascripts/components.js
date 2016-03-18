import selectFancy from '@npmcorp/pui-react-select-fancy';
import autocomplete from '@npmcorp/pui-react-autocomplete';
import TileLayout from '@npmcorp/pui-react-tile-layout';

module.exports = {
  DefaultH1: require('@npmcorp/pui-react-typography').DefaultH1,
  DefaultH2: require('@npmcorp/pui-react-typography').DefaultH2,
  DefaultH3: require('@npmcorp/pui-react-typography').DefaultH3,
  DefaultH4: require('@npmcorp/pui-react-typography').DefaultH4,
  DefaultH5: require('@npmcorp/pui-react-typography').DefaultH5,
  DefaultH6: require('@npmcorp/pui-react-typography').DefaultH6,

  AlternateH1: require('@npmcorp/pui-react-typography').AlternateH1,
  AlternateH2: require('@npmcorp/pui-react-typography').AlternateH2,
  AlternateH3: require('@npmcorp/pui-react-typography').AlternateH3,
  AlternateH4: require('@npmcorp/pui-react-typography').AlternateH4,
  AlternateH5: require('@npmcorp/pui-react-typography').AlternateH5,
  AlternateH6: require('@npmcorp/pui-react-typography').AlternateH6,

  MarketingH1: require('@npmcorp/pui-react-typography').MarketingH1,
  MarketingH2: require('@npmcorp/pui-react-typography').MarketingH2,
  MarketingH3: require('@npmcorp/pui-react-typography').MarketingH3,
  MarketingH4: require('@npmcorp/pui-react-typography').MarketingH4,
  MarketingH5: require('@npmcorp/pui-react-typography').MarketingH5,
  MarketingH6: require('@npmcorp/pui-react-typography').MarketingH6,

  Heading: require('@npmcorp/pui-react-typography').Heading,

  BasePane: require('@npmcorp/pui-react-panes').BasePane,
  Pane: require('@npmcorp/pui-react-panes').Pane,

  UIButton: require('@npmcorp/pui-react-buttons').UIButton,
  DefaultButton: require('@npmcorp/pui-react-buttons').DefaultButton,
  DefaultAltButton: require('@npmcorp/pui-react-buttons').DefaultAltButton,
  LowlightButton: require('@npmcorp/pui-react-buttons').LowlightButton,
  DangerButton: require('@npmcorp/pui-react-buttons').DangerButton,
  HighlightButton: require('@npmcorp/pui-react-buttons').HighlightButton,
  HighlightAltButton: require('@npmcorp/pui-react-buttons').HighlightAltButton,

  SearchInput: require('@npmcorp/pui-react-search-input').SearchInput,

  Divider: require('@npmcorp/pui-react-dividers').Divider,
  InverseDivider: require('@npmcorp/pui-react-dividers').InverseDivider,

  Row: require('@npmcorp/pui-react-grids').Row,
  Col: require('@npmcorp/pui-react-grids').Col,

  Media: require('@npmcorp/pui-react-media').Media,
  Flag: require('@npmcorp/pui-react-media').Flag,

  Radio: require('@npmcorp/pui-react-radio').Radio,
  RadioGroup: require('@npmcorp/pui-react-radio-group').RadioGroup,

  Panel: require('@npmcorp/pui-react-panels').Panel,
  SimplePanel: require('@npmcorp/pui-react-panels').SimplePanel,
  ClickablePanel: require('@npmcorp/pui-react-panels').ClickablePanel,
  ClickableAltPanel: require('@npmcorp/pui-react-panels').ClickableAltPanel,
  BasicPanel: require('@npmcorp/pui-react-panels').BasicPanel,
  BasicPanelAlt: require('@npmcorp/pui-react-panels').BasicPanelAlt,
  ShadowPanel: require('@npmcorp/pui-react-panels').ShadowPanel,
  HighlightPanel: require('@npmcorp/pui-react-panels').HighlightPanel,

  Image: require('@npmcorp/pui-react-images').Image,

  Icon: require('@npmcorp/pui-react-iconography').Icon,

  Modal: require('@npmcorp/pui-react-modals').Modal,
  ModalBody: require('@npmcorp/pui-react-modals').ModalBody,
  ModalFooter: require('@npmcorp/pui-react-modals').ModalFooter,

  Ribbon: require('@npmcorp/pui-react-ribbons').Ribbon,
  PrimaryRibbon: require('@npmcorp/pui-react-ribbons').PrimaryRibbon,
  Banner: require('@npmcorp/pui-react-ribbons').Banner,

  Tab: require('@npmcorp/pui-react-tabs').Tab,
  SimpleTabs: require('@npmcorp/pui-react-tabs').SimpleTabs,
  SimpleAltTabs: require('@npmcorp/pui-react-tabs').SimpleAltTabs,
  LeftTabs: require('@npmcorp/pui-react-tabs').LeftTabs,

  UnorderedList: require('@npmcorp/pui-react-lists').UnorderedList,
  OrderedList: require('@npmcorp/pui-react-lists').OrderedList,
  InlineList: require('@npmcorp/pui-react-lists').InlineList,
  GroupList: require('@npmcorp/pui-react-lists').GroupList,
  GroupListInverse: require('@npmcorp/pui-react-lists').GroupListInverse,
  StepList: require('@npmcorp/pui-react-lists').StepList,
  BreadcrumbList: require('@npmcorp/pui-react-lists').BreadcrumbList,
  ListItem: require('@npmcorp/pui-react-lists').ListItem,
  DraggableList: require('@npmcorp/pui-react-draggable-list').DraggableList,
  DraggableListItem: require('@npmcorp/pui-react-draggable-list').DraggableListItem,

  Dropdown: require('@npmcorp/pui-react-dropdowns').Dropdown,
  DropdownItem: require('@npmcorp/pui-react-dropdowns').DropdownItem,
  LinkDropdown: require('@npmcorp/pui-react-dropdowns').LinkDropdown,
  DefaultAltDropdown: require('@npmcorp/pui-react-dropdowns').DefaultAltDropdown,
  DangerDropdown: require('@npmcorp/pui-react-dropdowns').DangerDropdown,
  HighlightAltDropdown: require('@npmcorp/pui-react-dropdowns').HighlightAltDropdown,
  HighlightDropdown: require('@npmcorp/pui-react-dropdowns').HighlightDropdown,
  LowlightDropdown: require('@npmcorp/pui-react-dropdowns').LowlightDropdown,

  Notifications: require('@npmcorp/pui-react-notifications').Notifications,
  AlertNotifications: require('@npmcorp/pui-react-notifications').AlertNotifications,
  NotificationItem: require('@npmcorp/pui-react-notifications').NotificationItem,

  Label: require('@npmcorp/pui-react-labels').Label,
  BaseCollapse: require('@npmcorp/pui-react-collapse').BaseCollapse,
  Collapse: require('@npmcorp/pui-react-collapse').Collapse,
  AltCollapse: require('@npmcorp/pui-react-collapse').AltCollapse,

  ExpanderContent: require('@npmcorp/pui-react-expander').ExpanderContent,
  ExpanderTrigger: require('@npmcorp/pui-react-expander').ExpanderTrigger,

  SuccessAlert: require('@npmcorp/pui-react-alerts').SuccessAlert,
  InfoAlert: require('@npmcorp/pui-react-alerts').InfoAlert,
  WarningAlert: require('@npmcorp/pui-react-alerts').WarningAlert,
  ErrorAlert: require('@npmcorp/pui-react-alerts').ErrorAlert,

  OverlayTrigger: require('@npmcorp/pui-react-overlay-trigger').OverlayTrigger,
  Tooltip: require('@npmcorp/pui-react-tooltip').Tooltip,

  BackToTop: require('@npmcorp/pui-react-back-to-top').BackToTop,

  PortalSource: require('@npmcorp/pui-react-portals').PortalSource,
  PortalDestination: require('@npmcorp/pui-react-portals').PortalDestination,
  StreamList: require('@npmcorp/pui-react-stream-list').StreamList,
  StreamListItem: require('@npmcorp/pui-react-stream-list').StreamListItem,
  SortableTable: require('@npmcorp/pui-react-sortable-table').SortableTable,
  TableHeader: require('@npmcorp/pui-react-sortable-table').TableHeader,
  TableCell: require('@npmcorp/pui-react-sortable-table').TableCell,
  TableRow: require('@npmcorp/pui-react-sortable-table').TableRow,
  ...autocomplete,
  ...selectFancy,
  TileLayout: TileLayout};
