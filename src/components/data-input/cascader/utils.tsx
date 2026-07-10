import * as React from 'react';
import type {
  CascaderColumn,
  CascaderOption,
  CascaderPathOption,
  CascaderPathValue,
  CascaderProps,
  CascaderValue,
} from './types';

export function pathKey(path: CascaderPathValue) {
  return JSON.stringify(path);
}

export function getOptionLabelText(option: CascaderOption) {
  if (typeof option.label === 'string') return option.label;

  return option.value;
}

export function normalizeSelectedPaths(
  value: CascaderValue,
  multiple: boolean,
): CascaderPathValue[] {
  if (value == null) return [];
  if (multiple) return Array.isArray(value[0]) ? (value as string[][]) : [];

  return Array.isArray(value[0]) ? [] : [value as string[]];
}

export function isSamePath(left: CascaderPathValue, right: CascaderPathValue) {
  return (
    left.length === right.length && left.every((part, i) => part === right[i])
  );
}

export function hasChildren(option: CascaderOption) {
  return Array.isArray(option.children) && option.children.length > 0;
}

export function canExpand(option: CascaderOption) {
  return hasChildren(option) || option.isLeaf === false;
}

export function findPathOptions(
  options: CascaderOption[],
  value: CascaderPathValue,
) {
  const nodes: CascaderOption[] = [];
  let currentOptions = options;

  for (const part of value) {
    const option = currentOptions.find(item => item.value === part);

    if (!option) return [];

    nodes.push(option);
    currentOptions = option.children ?? [];
  }

  return nodes;
}

export function getPathLabel(
  options: CascaderOption[],
  value: CascaderPathValue,
  displayRender?: CascaderProps['displayRender'],
) {
  const nodes = findPathOptions(options, value);

  if (nodes.length === 0) return value.join(' / ');

  const labels = nodes.map(node => node.label);

  return displayRender
    ? displayRender(labels, nodes)
    : labels.map((label, index) => (
        <React.Fragment key={`${value[index]}-${index}`}>
          {index > 0 && <span className="text-ui-muted-foreground"> / </span>}
          {label}
        </React.Fragment>
      ));
}

export function getColumns(
  options: CascaderOption[],
  activePath: CascaderPathValue,
): CascaderColumn[] {
  const columns: CascaderColumn[] = [{ level: 0, options, prefix: [] }];
  let currentOptions = options;
  const prefix: CascaderPathValue = [];

  for (const part of activePath) {
    const option = currentOptions.find(item => item.value === part);

    if (!option?.children?.length) break;

    prefix.push(option.value);
    currentOptions = option.children;
    columns.push({
      level: columns.length,
      options: currentOptions,
      prefix: [...prefix],
    });
  }

  return columns;
}

export function flattenPathOptions(
  options: CascaderOption[],
  changeOnSelect: boolean,
  prefix: CascaderOption[] = [],
): CascaderPathOption[] {
  return options.flatMap(option => {
    const nextNodes = [...prefix, option];
    const nextValue = nextNodes.map(node => node.value);
    const children = option.children ?? [];
    const leaf = children.length === 0 || option.isLeaf === true;
    const includeCurrent = leaf || changeOnSelect;
    const childPaths = children.length
      ? flattenPathOptions(children, changeOnSelect, nextNodes)
      : [];

    return includeCurrent
      ? [{ nodes: nextNodes, value: nextValue }, ...childPaths]
      : childPaths;
  });
}

export function filterPathOptions(
  paths: CascaderPathOption[],
  keyword: string,
) {
  const normalized = keyword.trim().toLowerCase();

  if (!normalized) return paths;

  return paths.filter(path =>
    path.nodes
      .map(getOptionLabelText)
      .join(' / ')
      .toLowerCase()
      .includes(normalized),
  );
}
