import 'package:collection/collection.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:jonline/models/jonline_account_operations.dart';
import 'package:jonline/models/jonline_operations.dart';
import 'package:link_preview_generator/link_preview_generator.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../app_state.dart';
import '../../generated/posts.pb.dart';
import '../../models/settings.dart';

// import 'package:jonline/db.dart';

class PostPreview extends StatefulWidget {
  final String server;
  final Post post;
  final bool allowScrollingContent;
  final double? maxContentHeight;
  final VoidCallback? onTap;
  const PostPreview(
      {Key? key,
      required this.server,
      required this.post,
      this.maxContentHeight = 300,
      this.onTap,
      this.allowScrollingContent = false})
      : super(key: key);

  @override
  PostPreviewState createState() => PostPreviewState();
}

class PostPreviewState extends State<PostPreview> {
  String get title => widget.post.title;
  String? get link => widget.post.link.isEmpty
      ? null
      : widget.post.link.startsWith(RegExp(r'https?://'))
          ? widget.post.link
          : 'http://${widget.post.link}';
  List<int>? previewImage;
  String? get content =>
      widget.post.content.isEmpty ? null : widget.post.content;
  String? get username =>
      widget.post.author.username.isEmpty ? null : widget.post.author.username;
  int get replyCount => widget.post.replyCount;

  bool _hasFetchedServerPreview = false;

  @override
  void initState() {
    super.initState();
    fetchServerPreview();
  }

  @override
  dispose() {
    super.dispose();
  }

  fetchServerPreview() async {
    if (_hasFetchedServerPreview) return;

    final previewData = (await JonlineOperations.getSelectedPosts(
            request: GetPostsRequest(postId: widget.post.id),
            showMessage: showSnackBar))
        ?.posts
        .firstOrNull
        ?.previewImage;
    if (previewData != null && previewData.isNotEmpty) {
      setState(() {
        previewImage = previewData;
      });
    }
    setState(() {
      _hasFetchedServerPreview = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final Widget view = AnimatedContainer(
      duration: animationDuration,
      padding: const EdgeInsets.all(8.0), //child: Text('hi')
      child: Column(
        children: [
          // Text("hi"),
          Row(
            children: [
              Expanded(
                child: Text(
                  title,
                  style: content != null
                      ? Theme.of(context).textTheme.titleLarge
                      : title.length < 20
                          ? Theme.of(context).textTheme.titleLarge
                          : title.length < 255
                              ? Theme.of(context).textTheme.titleMedium
                              : Theme.of(context).textTheme.titleSmall,
                  // const TextStyle(
                  //     fontSize: 16, fontWeight: FontWeight.w500),
                  textAlign: TextAlign.left,
                ),
              ),
            ],
          ),
          if (content != null || link != null)
            Container(
                constraints: widget.maxContentHeight != null
                    ? BoxConstraints(maxHeight: widget.maxContentHeight!)
                    : null,
                child: Row(children: [
                  Expanded(
                      child: SingleChildScrollView(
                          physics: widget.allowScrollingContent
                              ? null
                              : const NeverScrollableScrollPhysics(),
                          child: Column(
                            children: [
                              if (link != null)
                                Container(
                                  height: 8,
                                ),
                              if (link != null &&
                                  (!Settings.preferServerPreviews ||
                                      previewImage == null))
                                buildLocallyGeneratedPreview(context),
                              if (Settings.preferServerPreviews &&
                                  previewImage != null)
                                buildProvidedPreview(context),
                              if (content != null)
                                Container(
                                  height: 8,
                                ),
                              if (content != null)
                                Row(
                                  children: [
                                    Expanded(
                                        child: MarkdownBody(data: content!)),
                                  ],
                                ),
                            ],
                          )))
                ])),
          const SizedBox(
            height: 8,
          ),
          Row(
            children: [
              const Text(
                "by ",
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w300,
                    color: Colors.grey),
              ),
              Expanded(
                child: Text(
                  username ?? noOne,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w300,
                      color: Colors.grey),
                ),
              ),
              const Expanded(child: SizedBox()),
              const Icon(
                Icons.reply,
                color: Colors.white,
              ),
              Text(
                replyCount.toString(),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const Text(
                " replies",
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ],
      ),
    );

    final card = Card(
        child: widget.onTap == null
            ? view
            : InkWell(onTap: widget.onTap, child: view));
    return card;
  }

  Widget buildProvidedPreview(BuildContext context) {
    return Tooltip(
      message: link!,
      child: SizedBox(
        height: 250,
        child: Stack(
          children: [
            Opacity(
              opacity: 0.8,
              child: Row(
                children: [
                  Expanded(
                    child: Image.memory(
                        Uint8List.fromList(
                          previewImage!,
                        ),
                        fit: BoxFit.fitWidth,
                        alignment: Alignment.topLeft),
                  ),
                ],
              ),
            ),
            InkWell(
                onTap: () => launchUrl(Uri.parse(link!)),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                vertical: 4, horizontal: 8),
                            color: Colors.black.withOpacity(0.8),
                            child: Text(
                              link!,
                              maxLines: 2,
                              textAlign: TextAlign.end,
                              overflow: TextOverflow.ellipsis,
                              style: Theme.of(context)
                                  .textTheme
                                  .caption!
                                  .copyWith(color: topColor),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ))
          ],
        ),
      ),
    );
  }

  Widget buildLocallyGeneratedPreview(BuildContext context) {
    // return Tooltip(
    //   message: link!,
    //   child: AnyLinkPreview(
    //     link: link!,
    //     displayDirection: UIDirection.uiDirectionHorizontal,
    //     showMultimedia: true,
    //     bodyMaxLines: 5,
    //     bodyTextOverflow: TextOverflow.ellipsis,
    //     titleStyle: const TextStyle(
    //       color: Colors.black,
    //       fontWeight: FontWeight.bold,
    //       fontSize: 15,
    //     ),
    //     bodyStyle: const TextStyle(color: Colors.grey, fontSize: 12),
    //     errorWidget: (previewImage != null && previewImage!.isNotEmpty)
    //         ? buildProvidedPreview(context)
    //         : buildPreviewUnavailable(context),
    //     // errorImage: "https://google.com/",
    //     cache: const Duration(days: 7),
    //     backgroundColor: Colors.grey[300],
    //     borderRadius: 12,
    //     removeElevation: false,
    //     boxShadow: const [BoxShadow(blurRadius: 3, color: Colors.grey)],
    //     // onTap: () {}, // This disables tap event
    //   ),
    // );

    // return LinkPreviewGenerator(
    //   bodyMaxLines: 3,
    //   link: link!,
    //   linkPreviewStyle: LinkPreviewStyle.large,
    //   showGraphic: true,
    // );

    return Tooltip(
      message: link!,
      child: LinkPreviewGenerator(
        key: ValueKey(link),
        bodyMaxLines: 3,
        link: link!,
        linkPreviewStyle:
            content != null ? LinkPreviewStyle.small : LinkPreviewStyle.large,
        // errorBody: '',
        errorWidget: (previewImage != null && previewImage!.isNotEmpty)
            ? buildProvidedPreview(context)
            : buildPreviewUnavailable(context),
        showGraphic: true,
      ),
    );

    // LinkPreview(
    //   key: ValueKey(link!),
    //   enableAnimation: true,
    //   onPreviewDataFetched: (data) {
    //     setState(() {
    //       _previewData = data;
    //     });
    //   },
    //   previewData: _previewData,
    //   text: link!,
    //   width: MediaQuery.of(context).size.width,
    // ),
  }

  Widget buildPreviewUnavailable(BuildContext context) {
    return InkWell(
      onTap: () {
        try {
          launchUrl(Uri.parse(link!));
        } catch (e) {}
      },
      child: Container(
        color: bottomColor.withOpacity(0.5),
        padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 16),
        child: Column(
          children: [
            Row(
              children: const [
                Expanded(child: Text('Preview unavailable 😔')),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                    child: Text(
                  link!,
                  style: Theme.of(context)
                      .textTheme
                      .labelLarge!
                      .copyWith(color: topColor),
                )),
              ],
            ),
          ],
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
