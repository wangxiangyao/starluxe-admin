export default [
  {
    path: "/analyze",
    name: "analyze",
    component: () => import("@/pages/analyze/analyze.vue"),
    children: [
      {
        path: "member",
        name: "analyzeMember",
        component: () => import("@/pages/analyze/member/member.vue")
      }
    ]
  }
];
