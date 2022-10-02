import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:jonline/models/jonline_account.dart';
import 'package:jonline/screens/posts/threaded_replies.dart';

import '../../app_state.dart';
import '../../generated/posts.pb.dart';
import '../../jonotifier.dart';
import '../../models/jonline_operations.dart';
import '../../models/server_errors.dart';
import '../../router/router.gr.dart';
import '../home_page.dart';
import 'post_preview.dart';

class PostDetailsPage extends StatefulWidget {
  final String server;
  final String postId;

  const PostDetailsPage({
    Key? key,
    @pathParam this.server = "INVALID",
    @pathParam this.postId = "INVALID",
  }) : super(key: key);

  @override
  PostDetailsPageState createState() => PostDetailsPageState();
}

class PostDetailsPageState extends State<PostDetailsPage> {
  late AppState appState;
  late HomePageState homePage;
  Jonotifier updateReplies = Jonotifier();
  final ValueNotifier<bool> updatingReplies = ValueNotifier(false);
  TextTheme get textTheme => Theme.of(context).textTheme;
  Post? subjectPost;

  @override
  void initState() {
    super.initState();
    appState = context.findRootAncestorStateOfType<AppState>()!;
    appState.accounts.addListener(updateState);
    appState.updateReplies.addListener(updateReplies);
    updatingReplies.addListener(updateState);
    homePage = context.findRootAncestorStateOfType<HomePageState>()!;
    homePage.scrollToTop.addListener(scrollToTop);
    updateReplies.addListener(updatePost);
    try {
      final post =
          appState.posts.value.posts.firstWhere((p) => p.id == widget.postId);
      subjectPost = post;
    } catch (e) {
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        try {
          final post = await JonlineOperations.getPosts(
              request: GetPostsRequest(postId: widget.postId),
              showMessage: showSnackBar);
          setState(() {
            subjectPost = post!.posts.first;
          });
        } catch (e) {
          showSnackBar("Failed to load post data for ${widget.postId} 😔");
          showSnackBar(formatServerError(e));
        }
      });
    }
  }

  @override
  dispose() {
    appState.updateReplies.removeListener(updateReplies);
    updatingReplies.removeListener(updateState);
    updateReplies.dispose();
    updatingReplies.dispose();
    scrollController.dispose();
    appState.accounts.removeListener(updateState);

    homePage.scrollToTop.removeListener(scrollToTop);
    super.dispose();
  }

  ScrollController scrollController = ScrollController();
  bool canReply = JonlineAccount.selectedAccount != null;

  updateState() {
    // print("PostDetailsPage.updateState");
    setState(() {
      canReply = JonlineAccount.selectedAccount != null;
    });
  }

  scrollToTop() {
    if (context.topRoute.name == 'PostDetailsRoute') {
      scrollController.animateTo(0,
          duration: animationDuration, curve: Curves.easeInOut);
      // gridScrollController.animateTo(0,
      //     duration: animationDuration, curve: Curves.easeInOut);
    }
  }

  get q => MediaQuery.of(context);
  updatePost() async {
    try {
      final post = await JonlineOperations.getPosts(
          request: GetPostsRequest(postId: widget.postId),
          showMessage: showSnackBar);
      setState(() {
        subjectPost = post!.posts.first;
        // showSnackBar("Updated post details! 🎉");
      });
    } catch (e) {
      showSnackBar("Failed to load post data for ${widget.postId} 😔");
      showSnackBar(formatServerError(e));
    }
  }

  onRefresh() async {
    updateReplies();
    await updatePost();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: subjectPost != null
            ? Center(
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 1000),
                  child: RefreshIndicator(
                    onRefresh: () async => await onRefresh(),
                    child: CustomScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      controller: scrollController,
                      slivers: [
                        const SliverToBoxAdapter(child: SizedBox(height: 48)),
                        SliverToBoxAdapter(
                          child: PostPreview(
                            server: widget.server,
                            post: subjectPost!,
                            maxContentHeight: null,
                          ),
                        ),
                        SliverPersistentHeader(
                          key: Key(
                              "replyHeader-$canReply-${updatingReplies.value}"),
                          floating: true,
                          // pinned: true,
                          delegate: HeaderSliver(subjectPost!, updateReplies,
                              widget.server, canReply, updatingReplies),
                        ),
                        ThreadedReplies(
                          post: subjectPost!,
                          server: widget.server,
                          updateReplies: updateReplies,
                          updatingReplies: updatingReplies,
                        ),
                        const SliverToBoxAdapter(
                          child: SizedBox(height: 48),
                        ),

                        // other sliver widgets
                      ],
                    ),
                  ),
                ),
              )
            : Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Text("Loading post data..."),
                  ],
                ),
              ));
  }

  showSnackBar(String message) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(message),
    ));
  }
}

class HeaderSliver extends SliverPersistentHeaderDelegate {
  final Post subjectPost;
  final Jonotifier updateReplies;
  final ValueNotifier<bool> updatingReplies;
  final String server;
  final bool canReply;

  HeaderSliver(this.subjectPost, this.updateReplies, this.server, this.canReply,
      this.updatingReplies);

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    // final q = MediaQuery.of(context);
    return Card(
      child: Column(
        children: [
          // PostPreview(
          //   server: server,
          //   post: subjectPost,
          //   maxContentHeight: null,
          // ),
          Expanded(
            child: Row(children: [
              Expanded(
                  child: TextButton(
                onPressed: updatingReplies.value ? null : () => updateReplies(),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          // Expanded(flex: 1, child: SizedBox()),
                          Icon(Icons.refresh),
                          Text(
                            "Update",
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ]),
                  ],
                ),
              )),
              Expanded(
                  child: TextButton(
                // key: ValueKey("replyButton-${JonlineAccount.selectedAccount}"),
                onPressed: canReply
                    ? () {
                        context.pushRoute(CreateReplyRoute(
                            postId: subjectPost.id, server: server));
                      }
                    : null,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.reply),
                          Text("Reply"),
                        ]),
                  ],
                ),
              )),
            ]),
          ),
        ],
      ),
    );
  }

  @override
  double get maxExtent => 48;

  @override
  double get minExtent => 48;

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) {
    return false;
  }
}
