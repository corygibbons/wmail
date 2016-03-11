const React = require('react')
const ReactDOM = require('react-dom')
const { Toggle, Paper, RaisedButton } = require('material-ui')
const flux = {
  settings: require('../../stores/settings')
}

/* eslint-disable react/prop-types */

module.exports = React.createClass({
  displayName: 'GeneralSettings',

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount: function () {
    flux.settings.S.listen(this.settingsChanged)
    ReactDOM.findDOMNode(this.refs.defaultDownloadInput).setAttribute('webkitdirectory', 'webkitdirectory')
  },

  componentWillUnmount: function () {
    flux.settings.S.unlisten(this.settingsChanged)
  },

  componentDidUpdate: function () {
    ReactDOM.findDOMNode(this.refs.defaultDownloadInput).setAttribute('webkitdirectory', 'webkitdirectory')
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  /**
  * Generates the state from the settings
  * @param store=settingsStore: the store to use
  */
  generateState: function (store = flux.settings.S.getState()) {
    return {
      showTitlebar: store.showTitlebar(),
      showAppBadge: store.showAppBadge(),
      showTrayIcon: store.showTrayIcon(),
      showAppMenu: store.showAppMenu(),
      spellcheckerEnabled: store.spellcheckerEnabled(),
      sidebarEnabled: store.sidebarEnabled(),
      notificationsEnabled: store.notificationsEnabled(),
      notificationsSilent: store.notificationsSilent(),
      alwaysAskDownloadLocation: store.alwaysAskDownloadLocation(),
      defaultDownloadLocation: store.defaultDownloadLocation(),
      openLinksInBackground: store.openLinksInBackground()
    }
  },

  getInitialState: function () {
    return this.generateState()
  },

  settingsChanged: function (store) {
    this.setState(this.generateState(store))
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  /**
  * Renders the app
  */
  render: function () {
    return (
      <div {...this.props}>
        <Paper zDepth={1} style={{ padding: 15, marginBottom: 5 }}>
          {
            process.platform !== 'darwin' ? undefined : [
              (<Toggle
                key='0'
                toggled={this.state.showTitlebar}
                label={<span><span>Show titlebar</span> <small>(Changes applied after restart)</small></span>}
                onToggle={(evt, toggled) => flux.settings.A.setShowTitlebar(toggled)} />),
              (<br key='1' />)
            ]
          }
          {
            process.platform === 'darwin' ? undefined : [
              (<Toggle
                key='2'
                toggled={this.state.showAppMenu}
                label='Show App Menu'
                onToggle={(evt, toggled) => flux.settings.A.setShowAppMenu(toggled)} />),
              (<br key='3' />)
            ]
          }
          <Toggle
            toggled={this.state.showAppBadge}
            label='Show app unread badge'
            onToggle={(evt, toggled) => flux.settings.A.setShowAppBadge(toggled)} />
          <br />
          <Toggle
            toggled={this.state.showTrayIcon}
            label='Show tray icon'
            onToggle={(evt, toggled) => flux.settings.A.setShowTrayIcon(toggled)} />
          <br />
          <Toggle
            toggled={this.state.sidebarEnabled}
            label='Show sidebar'
            onToggle={(evt, toggled) => flux.settings.A.setEnableSidebar(toggled)} />
        </Paper>
        <Paper zDepth={1} style={{ padding: 15, marginTop: 5, marginBottom: 5 }}>
          <Toggle
            toggled={this.state.spellcheckerEnabled}
            label={(<span><span>Spell-checker</span> <small>(Experimental, requires restart)</small></span>)}
            onToggle={(evt, toggled) => flux.settings.A.setEnableSpellchecker(toggled)} />
          <br />
          <Toggle
            toggled={this.state.openLinksInBackground}
            label='Open links in background'
            onToggle={(evt, toggled) => flux.settings.A.setOpenLinksInBackground(toggled)} />
        </Paper>
        <Paper zDepth={1} style={{ padding: 15, marginTop: 5, marginBottom: 5 }}>
          <Toggle
            toggled={this.state.notificationsEnabled}
            label='Show new mail notifications'
            onToggle={(evt, toggled) => flux.settings.A.setNotificationsEnabled(toggled)} />
          <br />
          <Toggle
            toggled={!this.state.notificationsSilent}
            label='Play notification sound'
            disabled={!this.state.notificationsEnabled}
            onToggle={(evt, toggled) => flux.settings.A.setNotificationsSilent(!toggled)} />
        </Paper>
        <Paper zDepth={1} style={{ padding: 15, marginTop: 5, marginBottom: 5 }}>
          <Toggle
            toggled={this.state.alwaysAskDownloadLocation}
            label='Always ask download location'
            onToggle={(evt, toggled) => flux.settings.A.setAlwaysAskDownloadLocation(toggled)} />
          <br />
          <div>
            <RaisedButton
              label='Select location'
              className='file-button'
              disabled={this.state.alwaysAskDownloadLocation}
              style={{ marginRight: 15 }}>
              <input
                type='file'
                ref='defaultDownloadInput'
                disabled={this.state.alwaysAskDownloadLocation}
                onChange={(evt) => flux.settings.A.setDefaultDownloadLocation(evt.target.files[0].path)}
                defaultValue={this.state.defaultDownloadLocation} />
            </RaisedButton>
            {this.state.alwaysAskDownloadLocation ? undefined : <small>{this.state.defaultDownloadLocation}</small>}
          </div>
        </Paper>
      </div>
    )
  }
})
