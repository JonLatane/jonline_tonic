import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:jonline/app_state.dart';
import 'package:jonline/models/jonline_account.dart';

class LoginPage extends StatefulWidget {
  final void Function(bool isLoggedIn)? onLoginResult;
  final bool showBackButton;
  const LoginPage({Key? key, this.onLoginResult, this.showBackButton = true})
      : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  AppState get appState => context.findRootAncestorStateOfType<AppState>()!;

  bool doingStuff = false;
  final FocusNode usernameFocus = FocusNode();
  final TextEditingController usernameController = TextEditingController();
  final FocusNode passwordFocus = FocusNode();
  final TextEditingController passwordController = TextEditingController();
  bool allowInsecure = false;

  String get serverAndUser => usernameController.value.text;
  String get server =>
      serverAndUser.contains('/') ? serverAndUser.split('/')[0] : 'jonline.io';
  String get username =>
      serverAndUser.contains('/') ? serverAndUser.split('/')[1] : serverAndUser;
  String get friendlyUsername => username == "" ? "no one" : username;
  String get password => passwordController.value.text;

  @override
  void initState() {
    super.initState();
    usernameController.addListener(() {
      setState(() {});
    });
    passwordController.addListener(() {
      setState(() {});
    });
  }

  @override
  dispose() {
    usernameFocus.dispose();
    usernameController.dispose();
    passwordFocus.dispose();
    passwordController.dispose();
    super.dispose();
  }

  createAccount() async {
    authenticate(
        "create account",
        JonlineAccount.createAccount(
            server, username, password, context, showSnackBar,
            allowInsecure: allowInsecure));
  }

  login() async {
    authenticate(
        "login",
        JonlineAccount.loginToAccount(
            server, username, password, context, showSnackBar,
            allowInsecure: allowInsecure));
  }

  authenticate(String action, Future<JonlineAccount?> generator) async {
    setState(() {
      doingStuff = true;
    });
    final account = await generator;
    if (account == null) {
      await Future.delayed(const Duration(milliseconds: 500));
      showSnackBar("Failed to $action.");
      setState(() {
        doingStuff = false;
      });
      return;
    }
    await Future.delayed(const Duration(milliseconds: 500));
    await account.updateUserData(showMessage: showSnackBar);
    setState(() {
      doingStuff = false;
    });
    if (!mounted) return;

    appState.updateAccountList();
    if (!mounted) return;
    context.navigateBack();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Login/Create Account"),
        leading: const AutoLeadingButton(
          ignorePagelessRoutes: true,
        ),
      ),
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 300),
          child: Column(
            children: [
              const Expanded(
                child: SizedBox(),
              ),
              TextField(
                focusNode: usernameFocus,
                controller: usernameController,
                keyboardType: TextInputType.url,
                enableSuggestions: false,
                autocorrect: false,
                maxLines: 1,
                cursorColor: Colors.white,
                style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w400,
                    fontSize: 14),
                enabled: !doingStuff,
                decoration: const InputDecoration(
                    border: InputBorder.none,
                    hintText: "Username",
                    isDense: true),
                onChanged: (value) {},
              ),
              const Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    "Specify server in username with \"/\".",
                    textAlign: TextAlign.right,
                    style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w400,
                        fontSize: 12),
                  )),
              const SizedBox(height: 2),
              Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    "e.g. jonline.io/jon, bobline.io/jon, ${server == 'jonline.io' || server == 'bobline.io' ? '' : "$server/bob, "}etc.",
                    textAlign: TextAlign.right,
                    style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w400,
                        fontSize: 12),
                  )),
              const SizedBox(height: 16),
              TextField(
                focusNode: passwordFocus,
                controller: passwordController,
                obscureText: true,
                enableSuggestions: false,
                autocorrect: false,
                maxLines: 1,
                cursorColor: Colors.white,
                style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w400,
                    fontSize: 14),
                enabled: !doingStuff,
                decoration: const InputDecoration(
                    border: InputBorder.none,
                    hintText: "Password",
                    isDense: true),
                onChanged: (value) {
                  // widget.melody.name = value;
                  //                          BeatScratchPlugin.updateMelody(widget.melody);
                  // BeatScratchPlugin.onSynthesizerStatusChange();
                },
              ),
              const SizedBox(height: 16),
              CheckboxListTile(
                title: const Text("Allow insecure connections",
                    style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w400,
                        fontSize: 12)),
                value: allowInsecure,
                onChanged: (newValue) {
                  setState(() {
                    allowInsecure = newValue!;
                  });
                },
              ),
              SizedBox(
                  height: 16,
                  child: allowInsecure
                      ? const Align(
                          alignment: Alignment.center,
                          child: Text(
                            "Passwords may be sent in plain text.",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                fontSize: 12),
                          ))
                      : null),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    flex: 4,
                    child: ElevatedButton(
                      onPressed:
                          doingStuff || username.isEmpty || password.isEmpty
                              ? null
                              : login,
                      child: Padding(
                        padding: const EdgeInsets.all(4.0),
                        child: Column(
                          children: [
                            const Text('Login'),
                            Text(
                              "as $friendlyUsername",
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                  // color: Colors.white,
                                  fontWeight: FontWeight.w400,
                                  fontSize: 12),
                            ),
                            Text(
                              "to $server",
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                  // color: Colors.white,
                                  fontWeight: FontWeight.w400,
                                  fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const Expanded(
                    flex: 1,
                    child: SizedBox(),
                  ),
                  Expanded(
                    flex: 6,
                    child: ElevatedButton(
                      onPressed:
                          doingStuff || username.isEmpty || password.isEmpty
                              ? null
                              : createAccount,
                      child: Padding(
                        padding: const EdgeInsets.all(4.0),
                        child: Column(
                          children: [
                            const Text('Create Account'),
                            Text(
                              friendlyUsername,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w400, fontSize: 12),
                            ),
                            Text(
                              "on $server",
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w400, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const Expanded(
                child: SizedBox(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  showSnackBar(String message) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(message),
    ));
  }
}
