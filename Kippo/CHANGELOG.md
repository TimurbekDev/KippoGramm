# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-20

### Added
- Initial release of Kippo framework
- Attribute-based routing with `[Command]`, `[Text]`, and `[CallbackQuery]` attributes
- Built-in session management with `ISessionStore` interface
- In-memory session storage implementation
- Middleware support with `IBotMiddleware` interface
- Session middleware for automatic session management
- Fluent keyboard builders (`InlineKeyboardBuilder` and `ReplyKeyboardBuilder`)
- ASP.NET Core integration via `AddKippo` extension method
- Background service for long polling
- Context API for handling updates
- Support for state-based message routing
- Extension methods for easy configuration

### Features
- `BotUpdateHandler` base class for creating bot handlers
- `CommandRouter` for routing updates to appropriate handlers
- Session state tracking
- Session data dictionary for storing user information
- Automatic session loading and saving
- Reply keyboard support with resize and one-time options
- Inline keyboard support with callback data and URL buttons
- Message context with reply, edit, and delete methods
- Callback query context for handling inline keyboard interactions

[1.0.0]: https://github.com/yourusername/KippoGramm/releases/tag/v1.0.0
