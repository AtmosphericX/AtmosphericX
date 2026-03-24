/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                            
                                     |_|                                                                                                                

    Created with ♥ by the AtmosphericX Team (KiyoWx, StarflightWx, Everwatch1, & CJ Ziegler)
    Discord: https://atmosphericx-discord.scriptkitty.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

*/


export const h_strings: Record<string, any> = {
    configuration_changed: `Configuration has been changed, you may need to restart AtmosphericX for changes to take full effect.`,
    display_unsupported_terminal: `Fancy display features have been disabled due to unsupported terminal type. Please use a different terminal for full functionality or change your configuration settings.`,
    portal_disabled_warning: `The web login portal is disabled. This may expose your AtmosphericX instance to unauthorized users. It's strongly recommended to enable the login portal in the configuration settings.`,
    update_available: `A new version of AtmosphericX is available to fetch. Current Version: {CURRENT} | Branch Version: {LATEST}`,
    tracking_node_message: `{TYPE} tracking node for {NAME} | {LON}, {LAT} via {SOURCE}`,
    fancy_display_system_info: `{bold}Uptime:{/bold} {UPTIME}\n{bold}Memory Usage:{/bold} {MEMORY} GB\n{bold}Heap Usage:{/bold} {HEAP} MB\n{bold}Events Processed:{/bold} {TOTAL_PROCESSED}\n{bold}Requests Processed:{/bold} {TOTAL_REQUESTS}\n`,
    streamer_bot_connection_success: `AtmosphericX has successfully connected to Streamer.bot!`,
    streamer_bot_mesonet_update: `Mesonet Update: {CONDITIONS}, Temp: {TEMPERATURE}°F, Dew Point: {DEW_POINT}°F, Humidity: {HUMIDITY}%, Wind: {WIND} mph`,
    configuration_validation_failed: `{FILE}'s hash doesn't match the expected value. Please use the correct configuration for this version!`,
    configuration_validation_incomplete: `Configuration validation incomplete. Some configuration files may be missing or not validated. Please ensure all configuration files are present and valid.`,
    streamber_bot_pulsepoint: `{ACTION} {EVENT} at {LOCATION}`,
    event_output: `{EVENT} {STATUS} [{TRACKING}] ({ISSUED})`,
    username_chars: /^[a-zA-Z0-9_\-\.!]{3,20}$/,
    password_chars : /^[a-zA-Z0-9_\-\.!@#$%^&*()]{4,50}$/,
    route_locations: {
        portal_direct_path: `/www/pages/portal.html`,
        setup_direct_path: `/www/pages/setup.html`,
        dashboard_direct_path: `/www/pages/dashboard.html`,
        dashboard_dev_path: `/www/pages/dev.html`,
        unknown_direct_path: `/www/pages/404.html`,
        widgets_direct_path:`/www/widgets/`,
        get_dashboard_endpoint: [`/`],
        get_widgets_endpoint: [`/widgets/:endpoint`],
        get_data_endpoint: [`/data/:endpoint`],
        get_placefile_endpoint: [`/placefiles/:type`],
        get_event_action_endpoint: [`/api/events/:action/:tracking`],
        get_query_endpoint: [`/api/query/:type`],
        post_login_endpoint: [`/api/portal/login`],
        post_reset_endpoint: [`/api/portal/reset`],
        post_logout_endpoint: [`/api/portal/logout`],
        post_signup_endpoint: [`/api/portal/signup{/:admin}`],  
        post_setup_endpoint: [`/api/portal/verify`],
        post_create_endpoint: [`/api/create/:type`],
    },
    route_messages: {
        response_generic_error: `An error occurred while processing your request. Please try again later.`,
        resposne_invalid_tracking: `Invalid tracking code provided.`,
        response_placefile_disabled: `This placefile endpoint is disabled on the server. Please enable it in the configurations if you are the server administrator.`,
        response_ratelimited: `You are being rate limited. Please try again shortly.`,
        response_account_protection: `Account protection activated: Too many requests to account. Please wait before trying again.`,
        response_incorrect_credentials: `Incorrect username or password. Please try again.`,
        response_account_deactivated: `Your account is not activated. Contact your administrator for activation.`,
        response_account_duplicate: `This account is already active in another session. Please log out elsewhere before logging in.`,
        response_login_success: `Login successful!`,
        session_logout_message: `You have been logged out successfully.`,
        response_guest_access_disabled: `Guest access is disabled on this server. Please log in with a valid account.`,
        response_successful_signup: `Account created! Please contact your administrator for activation.`,
        response_successful_reset: `Password reset successful! You can now log in with your new password.`,
        response_invalid_string: `Input contains invalid characters. Only use letters, numbers, underscores, hyphens, and periods. You may also not have minimum length requirements.`,
        response_no_active_session: `No active session found. Please log in to continue.`,
        response_account_exists: `Username already exists. Please choose another.`,
        response_invalid_auth_code: `Invalid setup authentication code. Please check the code and try again. If you need a new code, refresh the setup page to generate one.`,
        response_setup_already_completed: `Setup has already been completed on this instance.`,
        response_admin_creation_unauthorized: `Unauthorized admin account creation attempt detected.`,
        response_valid_auth_code: `Setup authentication successful! Proceed to create your admin account`,
        response_admin_account_created: `Admin account created successfully! You can now log in with your admin credentials. Please remember your password. If you do forget it, you will need to delete the accounts.db file to reset your instance.`,
        websocket_invalid_address: `Connection rejected: Invalid or missing IP address.`,
        websocket_connection_closed: `Connection closed: Maximum connections reached.`,
        websocket_data_already_sent: `Request already processed. Disconnecting to prevent abuse.`,
        websocket_invalid_request: `Invalid request format. Please check your request structure.`,
        websocket_malformed: `Malformed request. Please review your data and try again.`,
        websocket_unknown_type: `Unknown request type. Refer to the documentation for valid types.`,
        websocket_update_success: `Subscription update successful.`,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Credentials': 'true',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store',
            'Vary': 'Cookie',
        }
    },
    tooltips: [
        `Press 'Esc' or 'Ctrl + C' to exit AtmosphericX at any time.`,
        `Discord Server: https://atmosphericx-discord.scriptkitty.cafe`,
        `Consider supporting the project on Ko-Fi: https://ko-fi.com/k3yomi`,
        `Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation`,
        `AtmosphericX is created and maintained by the AtmosphericX Team (KiyoWx, StarflightWx, Everwatch1, & CJ Ziegler)`,
        `Fun fact: AtmosphericX v8 took 9 months to develop!`,
        `CJ, turn off your ambers >:) it hurts my eyes.`,
        `AtmosphericX is designed to be modular and extensible. If you have ideas for new features or want to contribute, check out our GitHub repository!`,
    ]
};