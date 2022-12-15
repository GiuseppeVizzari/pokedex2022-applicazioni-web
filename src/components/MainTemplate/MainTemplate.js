import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

function MainTemplate(props) {
    const {
        children,
        footerCourseName, footerCourseLink,
        navItems,
        logo
    } = props;

    return (
        <>
            <Header
                logo={logo}
                navItems={navItems}
            />
            <div className="my-5">

                {children}

            </div>
            <Footer
                courseName={footerCourseName}
                courseLink={footerCourseLink}
                navItems={navItems}
            />
        </>
    )
}

export default MainTemplate;




