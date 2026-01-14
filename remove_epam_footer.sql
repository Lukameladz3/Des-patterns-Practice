UPDATE server_settings 
SET value = '[{"name": "Chat with us on Slack", "url": "https://slack.epmrpp.reportportal.io/", "order": 1}, {"name": "Contact us", "url": "mailto:support@reportportal.io", "order": 2}]' 
WHERE key = 'server.footer.links';