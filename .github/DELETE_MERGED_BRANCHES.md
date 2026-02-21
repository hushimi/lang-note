# GitHub マージ済みブランチ自動削除設定

このリポジトリでは、PRがマージされた際に自動的にブランチを削除するGitHub Actionsワークフローが設定されています。

## 設定内容

### GitHub Actions ワークフロー

`.github/workflows/delete-merged-branch.yml` が以下の動作を行います：

- **トリガー**: PRがマージされた時（`pull_request: closed` かつ `merged == true`）
- **保護ブランチ**: `main`, `master`, `develop` は削除されません
- **権限**: ブランチを削除するために `contents: write` 権限が必要です

## 動作

1. PRがマージされると、ワークフローが自動的に実行されます
2. マージされたブランチ名を取得します
3. ブランチが保護ブランチ（`main`, `master`, `develop`）でないことを確認します
4. 保護ブランチでない場合、リモートブランチを削除します

## 保護ブランチ

以下のブランチは自動削除の対象外です：

- `main`
- `master`
- `develop`

## 手動設定（GitHub UI）

GitHubリポジトリの設定でも同様の機能を有効化できますが、保護ブランチの指定はできません：

1. リポジトリの **Settings** → **General** に移動
2. **Pull Requests** セクションまでスクロール
3. **Automatically delete head branches** を有効化

**注意**: GitHub UIの設定では、すべてのマージ済みブランチが削除されるため、保護ブランチの指定はできません。このワークフローを使用することで、`main`, `master`, `develop` を保護できます。

## トラブルシューティング

### ブランチが削除されない場合

1. **権限の確認**: ワークフローに `contents: write` 権限が設定されているか確認
2. **保護ブランチの確認**: ブランチ名が `main`, `master`, `develop` でないか確認
3. **ワークフローの実行ログ**: GitHub Actions のログを確認してエラーがないか確認

### 手動でブランチを削除する場合

```bash
git push origin --delete <branch-name>
```

## 参考

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pull Request Events](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request)
