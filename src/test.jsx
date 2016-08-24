import Debugging from 'utils/Debugging';
import Permissions from 'utils/Permissions';

const PathVariants = {
  TWITTER_CARD_PARAM: 'card',
};

const isRouteVariant = nextState => {
  const params = nextState.location.pathname.split('/').filter(param => !!param);
  // params = ['w', ':broadcastId', TWITTER_CARD_PARAM]
  return params.length === 3 &&
         params[params.length - 1].indexOf(PathVariants.TWITTER_CARD_PARAM) === 0;
};

const discoverOnEnter = (nextState, replace) => {
    const { location, params } = nextState;
    const { channelName } = params;

    if (Debugging._isProd() || Permissions.isDisabled('DiscoverRoute')) {
      replace({ nextPathname: location.pathname }, '/');
    }

    // downcase all channel names before entering into the component
    if (channelName && channelName.toLowerCase() !== channelName) {
      replace({ nextPathname: location.pathname }, `/discover/${channelName.toLowerCase()}`);
    }
}

const broadcastOnEnter = nextState => {
	if (nextState.params && nextState.params.username === 'w') {
	  delete nextState.params.username;
	}
}

export default ({ api }) => (
	<RouteSplit path="/">
		<Route when={nextState => isRouteVariant(nextState)} onEnter={() => api.setClientVersion('Card')} component="../components/CardView.js" chunk="card-view">
			<Chunk>
				<Route path="w/:broadcastId/card" component="../components/containers/TwitterCard.js"/>
			</Chunk>
		</Route>
		<Route when={nextState => !isRouteVariant(nextState)} onEnter={() => api.setClientVersion('App')} component="../components/AppView.js" chunk="app-view">
			<Chunk>
				<Route path="couchmode" component="../components/containers/Couchmode.js"/>
				<Route path="discover(/:channelName)" onEnter={discoverOnEnter} component="../components/containers/Discover.js" chunk="discover-view" />
				<Route path=":username/:broadcastId" onEnter={broadcastOnEnter} component="../components/containers/UserBroadcast.js"/>
				<Route path=":username" component="../components/containers/User.js">
				  <Chunk>
				  	<Route path="/:username/:broadcastId" onEnter={broadcastOnEnter} component="../components/containers/UserBroadcast.js"/>
				  </Chunk>
				</Route>
			</Chunk>
		</Route>
	</RouteSplit>
)
