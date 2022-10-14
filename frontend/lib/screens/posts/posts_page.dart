import 'dart:math';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:implicitly_animated_reorderable_list_2/implicitly_animated_reorderable_list_2.dart';
import 'package:implicitly_animated_reorderable_list_2/transitions.dart';
import 'package:jonline/jonline_state.dart';

import '../../app_state.dart';
import '../../generated/posts.pb.dart';
import '../../models/jonline_server.dart';
import '../../router/router.gr.dart';
import 'post_preview.dart';

class PostsScreen extends StatefulWidget {
  const PostsScreen({Key? key}) : super(key: key);

  @override
  PostsScreenState createState() => PostsScreenState();
}

class PostsScreenState extends JonlineState<PostsScreen>
    with AutoRouteAwareStateMixin<PostsScreen> {
  ScrollController scrollController = ScrollController();

  @override
  void didPushNext() {
    // print('didPushNext');
  }

  @override
  void initState() {
    // print("PostsPage.initState");
    super.initState();
    appState.accounts.addListener(onAccountsChanged);
    for (var n in [
      appState.posts,
      appState.updatingPosts,
      appState.didUpdatePosts
    ]) {
      n.addListener(onPostsUpdated);
    }
    homePage.scrollToTop.addListener(scrollToTop);
    WidgetsBinding.instance
        .addPostFrameCallback((_) => appState.updateAccountList());
  }

  @override
  dispose() {
    // print("PostsPage.dispose");
    appState.accounts.removeListener(onAccountsChanged);
    for (var n in [
      appState.posts,
      appState.updatingPosts,
      appState.didUpdatePosts
    ]) {
      n.removeListener(onPostsUpdated);
    }
    homePage.scrollToTop.removeListener(scrollToTop);
    scrollController.dispose();
    super.dispose();
  }

  onAccountsChanged() {
    setState(() {});
  }

  onPostsUpdated() {
    setState(() {});
  }

  scrollToTop() {
    if (context.topRoute.name == 'PostsRoute') {
      scrollController.animateTo(0,
          duration: animationDuration, curve: Curves.easeInOut);
      // gridScrollController.animateTo(0,
      //     duration: animationDuration, curve: Curves.easeInOut);
    }
  }

  bool get useList => mq.size.width < 450;
  @override
  Widget build(BuildContext context) {
    final List<Post> postList = appState.posts.value.posts;
    return Scaffold(
      // appBar: ,
      body: RefreshIndicator(
        displacement: mq.padding.top + 40,
        onRefresh: () async =>
            await appState.updatePosts(showMessage: showSnackBar),
        child: ScrollConfiguration(
            // key: Key("postListScrollConfiguration-${postList.length}"),
            behavior: ScrollConfiguration.of(context).copyWith(
              dragDevices: {
                PointerDeviceKind.touch,
                PointerDeviceKind.mouse,
                PointerDeviceKind.trackpad,
                PointerDeviceKind.stylus,
              },
            ),
            child: postList.isEmpty && !appState.didUpdatePosts.value
                ? Column(
                    children: [
                      Expanded(
                        child: SingleChildScrollView(
                            physics: const AlwaysScrollableScrollPhysics(),
                            controller: scrollController,
                            child: Column(
                              children: [
                                SizedBox(
                                    height:
                                        (MediaQuery.of(context).size.height -
                                                200) /
                                            2),
                                Row(
                                  children: [
                                    const Expanded(child: SizedBox()),
                                    Column(
                                      children: [
                                        Text(
                                            appState.updatingPosts.value
                                                ? "Loading Posts..."
                                                : appState.errorUpdatingPosts
                                                        .value
                                                    ? "Error Loading Posts"
                                                    : "No Posts!",
                                            style: textTheme.titleLarge),
                                        Text(
                                            JonlineServer.selectedServer.server,
                                            style: textTheme.caption),
                                      ],
                                    ),
                                    const Expanded(child: SizedBox()),
                                  ],
                                ),
                              ],
                            )),
                      ),
                    ],
                  )
                : useList
                    ? ImplicitlyAnimatedList<Post>(
                        physics: const AlwaysScrollableScrollPhysics(),
                        controller: scrollController,
                        // controller: PrimaryScrollController.of(context),
                        // The current items in the list.
                        items: postList,

                        // Called by the DiffUtil to decide whether two object represent the same item.
                        // For example, if your items have unique ids, this method should check their id equality.
                        areItemsTheSame: (a, b) => a.id == b.id,
                        padding: EdgeInsets.only(
                            top: mq.padding.top, bottom: mq.padding.bottom),
                        // Called, as needed, to build list item widgets.
                        // List items are only built when they're scrolled into view.
                        itemBuilder: (context, animation, post, index) {
                          // Specifiy a transition to be used by the ImplicitlyAnimatedList.
                          // See the Transitions section on how to import this transition.
                          return SizeFadeTransition(
                            sizeFraction: 0.7,
                            curve: Curves.easeInOut,
                            animation: animation,
                            child: PostPreview(
                              server: JonlineServer.selectedServer.server,
                              onTap: () {
                                context.pushRoute(PostDetailsRoute(
                                    postId: post.id,
                                    server:
                                        JonlineServer.selectedServer.server));
                              },
                              post: post,
                            ),
                          );
                        },
                      )
                    : MasonryGridView.count(
                        physics: const AlwaysScrollableScrollPhysics(),
                        controller: scrollController,
                        crossAxisCount: max(
                            2,
                            min(6, (MediaQuery.of(context).size.width) / 290)
                                .floor()),
                        mainAxisSpacing: 4,
                        crossAxisSpacing: 4,
                        itemCount: postList.length,
                        itemBuilder: (context, index) {
                          final post = postList[index];
                          return PostPreview(
                            server: JonlineServer.selectedServer.server,
                            maxContentHeight: 400,
                            onTap: () {
                              context.pushRoute(PostDetailsRoute(
                                  postId: post.id,
                                  server: JonlineServer.selectedServer.server));
                            },
                            post: post,
                          );
                        },
                      )),
      ),
    );
  }

  showSnackBar(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(message),
    ));
  }
}