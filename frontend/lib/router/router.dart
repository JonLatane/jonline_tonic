import 'package:auto_route/auto_route.dart';
import 'package:jonline/router/auth_guard.dart';
import 'package:jonline/screens/events/routes.dart';
import 'package:jonline/screens/home_page.dart';
import 'package:jonline/screens/login_page.dart';
import 'package:jonline/screens/posts/routes.dart';
import 'package:jonline/screens/accounts/routes.dart';
import 'package:jonline/screens/settings.dart';
import 'package:jonline/screens/user-data/routes.dart';

@MaterialAutoRouter(
  replaceInRouteName: 'Page|Screen,Route',
  routes: <AutoRoute>[
    // app stack
    AutoRoute<String>(
      path: '/',
      page: HomePage,
      guards: [AuthGuard],
      deferredLoading: true,
      children: [
        postsTab,
        eventsTab,
        // AutoRoute(
        //   deferredLoading: true,
        //   path: 'posts',
        //   page: EmptyRouterPage,
        //   name: 'PostsTab',
        //   initial: true,
        //   maintainState: true,
        //   children: [
        //     AutoRoute(
        //       path: '',
        //       page: PostListScreen,
        //     ),
        //     AutoRoute(
        //       path: 'post/:id',
        //       page: PostDetailsPage,
        //       fullscreenDialog: true,
        //     ),
        //   ],
        // ),
        // AutoRoute(
        //   deferredLoading: true,
        //   path: 'events',
        //   page: EmptyRouterPage,
        //   name: 'EventsTab',
        //   initial: true,
        //   maintainState: true,
        //   children: [
        //     AutoRoute(
        //       path: '',
        //       page: EventListScreen,
        //     ),
        //     AutoRoute(
        //       path: ':id',
        //       page: EventDetailsPage,
        //       fullscreenDialog: true,
        //     ),
        //   ],
        // ),
        accountsTab,
        AutoRoute(
          path: 'settings/:tab',
          page: SettingsPage,
          name: 'SettingsTab',
        ),
      ],
    ),
    userDataRoutes,
    // auth
    AutoRoute(page: LoginPage, path: '/login'),
    RedirectRoute(path: '*', redirectTo: '/'),
  ],
)
class $RootRouter {}
